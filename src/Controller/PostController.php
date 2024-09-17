<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\User;
use App\Form\PostType;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class PostController extends AbstractController
{
    /*Al poner la ruta post nos da error xq symfony 6 usa web pacj encore, pero en este momento no nos interesa usarlo, entonces
    nos vamos al archivo base.html.twig en la carpeta templates.
    Podemos add params a la ruta, ej: puedes recibir un num y buscar en la base, '/post/{id}' ponemos el atri que queremos buscar, por eso
    ponemos un id, quiero que busqque a traves del id a un post, por eso ponemos Post en la funcion index(Post $post):. Si ponemos la ruta
    saldra que no existe xq falta que le pasemos un param, osea el id del post, le ponemos el 1 para que nos de el post 1
    */

    private $em; //var de entity manager
    /**
     * @param $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em; //el em de arriba sera igual al em que estoy recibiendo como param
    }

    // #[Route('/post/{id}', name: 'app_post')]
    // public function index($id): Response //el id se puede recibir como Post $post o $id
    // {
    //     //con getRepository llamamos la entidad post y usamos el metodo magico find() que busca por id
    //     $post = $this->em->getRepository(Post::class)->find($id);
    //     $custom_post = $this->em->getRepository(Post::class)->findPost($id); //ponemos el metodo que se puso en el repo
    //     // $posts = $this->em->getRepository(Post::class)->findAll($id); //con findAll() traemos todos los post de la base
    //     // $posts = $this->em->getRepository(Post::class)->findBy(['id' => 1, 'title' => 'Mi primer post de prueba']);
    //     /*con findBy() encuentra uno o varios objs de la base dependiendo de unos params, el 1° param es el criterio de busqueda, el 2° es el orden
    //     en el que yo quiero que me muestre, el 3° son los limites. (["Busca los post cuyo id sea = a 1","ademas busca los post cuyo titulo sea = a Mi primer Post de prueba"]).
    //     En esta caso solo regresa uno, pero tmb pueden ser varios, por eso nos regresa un array, xq pueden ser que varios tengan el mismo titulo, en ese caso se llaman los 2,
    //     si ponemos que busque el que tiene ese titulo y el id 1 nos da el 1° xq los dos tienen el mismo title, pero solo el primero tiene el mismo id, osea 1*/

    //     // $post = $this->em->getRepository(Post::class)->findOneBy(['id' => 1]); //este solo encuentra uno por un criterio de busqueda, no nos da un array, si no uno solo dependiendo del criterio de busqueda
    //     // dump($post); //imprimimos la info del post que acabo de encontrar. Si queremos este val en el template y no abajo en las opciones de symf, lo ponemos en el metodo de abajo
    //     /*Cada que entramos a una ruta, lo que hace symfony es irse al controlador, busca la ruta y ejecuta el metodo o la funcion que este
    //     abajo de la ruta y ejecuta la logica de la funcion y renderiza un template que es el index que esta en la carpeta post, osea el puntero
    //     se ubica en la carpet templates
    //     */
    //     return $this->render('post/index.html.twig', [
    //         // 'controller_name' => 'PostController',
    //         // 'controller_name' => ['saludo' => 'Hola mundo', 'nombre' => 'Walter'],
    //         // 'post' => $post //esta var se la pasamos al index.twig para ver la info del post
    //         'post' => $post,
    //         'custom_post' => $custom_post //lo pasamos al template
    //     ]);
    // }

    //*El que comentamos arriba es el primer ctrl que hicimos. Con los forms el user es el que crea los post, no se los pasamos por el ctrl
    #[Route('/', name: 'app_post')]
    public function index(
        Request $request,
        SluggerInterface $slugger,
        PaginatorInterface $paginator,
        #[Autowire('%kernel.project_dir%/public/uploads/files')] string $filesDirectory
    ): Response //obtenemos la solicitud con request
    {
        $post = new Post(); //este ctrl no tiene params xq se inici en null, osea ya tienen ese val por defec en la entidad Post
        $posts = $this->em->getRepository(Post::class)->findAllPostsResult(); //traemos todos los post. Le cambiamos el name a query
        $query = $this->em->getRepository(Post::class)->findAllPosts(); //traemos todos los post. Le cambiamos el name a query

        $pagination = $paginator->paginate( //iniciali una paginacion, osea que muestre de un rango de nums
            $query, /* query NOT result. Se recibe el query del repo */
            $request->query->getInt('page', 1), /*page number. El request es el que tenemos arriba y nos dice que sera de tipo paginador y que la pag por defec es la 1*/
            2 /*limit per page. Cuantos post por pagina*/
        );
        $form = $this->createForm(PostType::class, $post); //ponemos el form que creamos y que estara relaci con la var post. El form tendra los campos del post y si no existe, lo crea
        $form->handleRequest($request); //obtiene la peticion y le pasamos el request de arriba
        if ($form->isSubmitted() && $form->isValid()) { //si el form es enviado y el form es valido, haz algo
            $file = $form->get('file')->getData(); //obtenemos la info del campo file
            // $post->setCreationDate(new \DateTime()); //esta es una buena forma de hacerlo, pero no es necesaria xq se inicial en el constr de la entidad
            $url = str_replace(" ", "-", $form->get('title')->getData()); //reemplazamos los space del title del form por un guion. getData() obtiene el title
            if ($file) {
                //si existe el archivo add un nuevo nombre
                $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename); //obtiene un name seguro
                /*esto es util en entornos productivos, para que las personas si quieren subir un archivo
                que tenga un name extraño o un arch malicioso, este slugger le cambia el name y de esa manera no tienen como acceder archivo, ej si quieren subir un
                script o un php que ataque a la base, etc.*/
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension(); //lo codificamos con la libreria slugger, osea al arch le add un hash
                try { //movemos el arch
                    $file->move($filesDirectory, $newFilename);
                } catch (FileException $e) {
                    throw new Exception('Ups there is a problem with your file');
                }
                $post->setFile($newFilename); //si esto no pasa es xq podemos cambiar el name al arch
            }
            $post->setUrl($url); //cambiamos la url del post
            //*Usar los form que no estan relacionados a una entidad. https://www.youtube.com/watch?v=cWESbDaKgYQ&list=PLDbrnXa6SAzVxekjG2LBmJ5WxO4iypGlq&index=9
            $user = $this->em->getRepository(User::class)->find(1); //buscamos al user actualmente logeado, pero para ello necesitamos un login
            $post->setUser($user); //edita el user por el user que tengo arriba
            $this->em->persist($post); //hace un persist del post
            $this->em->flush(); //le ponemos que lo escriba
            return $this->redirectToRoute('app_post'); //lo redireccionamos a la ruta, no le pasamos el val de la ruta, si no el nombre de la ruta.
            //Cuando se envie el form y lo esccriba en la base, el redirecccione a un sitio, a una ruta, ctrl, una ruta especifica, para eso usamos el nombre de la ruta
        }
        return $this->render('post/index.html.twig', [
            'form' => $form->createView(), //le pasamos el form
            'posts' => $posts, //le pasamos los posts al templat pa tenerlos todos
            'pagination' => $pagination // tenerlos todos
        ]);
    }


    //da err xq la ruta la toma como id, por eso se pone '/insert/post' en ves de '/post/insert' xq esta ultima da err
    // #[Route('/remove/post', name: 'insert_post')]
    // public function insert()
    // {
    //     /*insertamos un post con el em (entity manager). El em sirve para hacer consultas, tmb podemos insertar, actualizar y eliminar en la base
    //     Hay varias maneras de insertar un post, xq el doctrine usa las entidades para escribir, consultar, o para eliminar, por eso debemos usar
    //     la POO para realizar esta tarea.*/
    //     // $post = new Post('Mi post insertado 2', 'Opinion', 'Hola mundo', 'holita.jpg', '', 'hola mundo'); //en ves de usar el met set, los pasamos por aca. Este es para insertar
    //     $post = $this->em->getRepository(Post::class)->find(4); //que me busque el post con el id 4 para update (actualizar) o remove (eliminar)
    //     $post->setTitle('Mi nuevo titulo'); //actualizamos el title
    //     $this->em->remove($post); //removemos un post en especifico
    //     // $user = $this->em->getRepository(User::class)->find(1); //traemos el user con el id 1. Este no se usa en actualizar
    //     // $post->setUser($user); //este post no tiene user, por eso se lo pasamos asi. Este no se usa en actualizar
    //     // $post->setTitle('Mi Post Insertado') //Al crear el construct podemos eliminar este metodo
    //     //     ->setDescription('Hola Mundo')
    //     //     ->setCreationDate(new \DateTime())
    //     //     ->setUrl('Mi url')
    //     //     ->setFile('hola mundo')
    //     //     ->setType('opinion')
    //     //     ->setUser($user);
    //     // $this->em->persist($post); //que tengamos esto no significa que lo vaya a ser, para eso necesitamos un flush. Este met no lo usamos en actualizar xq ya el title esta en la base
    //     $this->em->flush(); //esta linea se encarga de escribir en la base. El flush debe estar presente en todas estas operaciones, si no, no las va a escribir en la base
    //     return new JsonResponse(['success' => true]);
    // }
    // esto se comento xq solo era un ej de un video anterior

    /*esta fun es la info general del post. Para usar un link dinamico usamos path, con este podemos navegar en la pag xq es la fun encargada de generar las rutas
    lo primero en tener en cuenta es que params necesita la ruta, en este caso la fun app_post no necesita ningun param, pero la funcion de postDetails si necesita un
    param que es el id, ese id ya lo tenemos en la tabla que hicimos en post.html.twig*/
    #[Route('/post/details/{id}', name: 'postDetails')]
    public function postDetails(Post $post)
    {
        //en este link podemos cambiar copiar y cambiar los detalles del post: https://github.com/Diiego1500/frikyland/blob/main/templates/post/post-details.html.twig
        return $this->render('post/post-details.html.twig', ['post' => $post]);
    }
}

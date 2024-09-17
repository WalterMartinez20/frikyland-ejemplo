<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    // public function findPost($id)
    // {
    //     /*Este lenguaje se llama dql,  doctrine query language
    //     creamos una consulta personalizada a una entidad. Como estamos usando el repo de post, vamos a consultar un post en especifico.
    //     Esto es bases combinado con doctrine. Con la consulta traemos solo el id de la entidad post, y el alias que seria siempre post,
    //     y como necesitamos un post, pero cual? Por eso ponemos where, y el id lo parametizamos con setParameter()
    //     */
    //     // return $this->getEntityManager()
    //     //     ->createQuery('SELECT post.id FROM App:Post post WHERE post.id =:id')
    //     //     ->setParameter('id', $id)->getResult(); //el 1° id es el de la consulta y el 2° es el param que se le pasa a la funcion
    //     //*lo hacemos de esta manera xq lo de arriba daba error
    //     return $this->createQueryBuilder('post')
    //         ->select('post.id, post.title, post.type') //ponemos varios vals para mostrar
    //         ->where('post.id=:id')
    //         ->setParameter('id', $id)
    //         ->getQuery()
    //         // ->getResult();
    //         ->getSingleResult(); //con getSingleResult no tira varios result, si no uno solo, ya no tira una matriz de resultados
    //     /*La dife es que con los met magicos nos da un obj y con doctrine nos da un array, tienen la misma info, pero con dql tengo la posibilidad
    //     de decirle que datos practicamente traer xq puede ser que solo necesite algunos datos y no todos. El primer met nos puede funcionar pero con
    //     pocos datos, pero si son 10,000 registros cada uno de esos datos adicionales que no estamos usando es espacio desperdiciado y se puede hacer la
    //     consulta o la pagina lenta, pero con estos met mejora la optimizacion*/
    // }//*esto se comenta xq solo es un ejemplo

    public function findAllPosts() //no necesita params xq se traen todos
    {
        return $this->createQueryBuilder('post')
            /*si ponemos solo post nos trae todos los datos de post, pero si ponemos campos, nos trae estos en especifico
            el user.id se llamara igual que post.id, osea id, por eso tenemos que ponerle un alias con "AS"*/
            ->select('post.id, post.title, post.description, post.file, post.creation_date, post.url') //lo quitamos xq no se usara con el paginador, user.id AS user_id, user.email AS user_username')
            // ->join('post.user', 'user') //acced al user del post y le ponemos el alias user, con esto podemos traer los atri del user. Se elimina tmb por el paginador
            ->orderBy('post.id', 'DESC')
            ->getQuery();
        // ->getResult(); //se pone este xq se traen todos. Este tmb lo eliminamos xq es el resultado y solo necesitamos la query, pero con esto se eliminan los post
        /*Aca falta el user, este es una relacion. Cuando usamos dql tenemos acceso a todos los campos de la tabla, pero el user_id es
        una relacion entre la tabla post y user, osea hay que acceder a user desde post, osea la relacion se va para el user_id del post y
        obtiene la info del user que necesito, si necesito info del user dentro de la tabla post hacemos un join, que es una union de tablas
        */
    }
    public function findAllPostsResult() //no necesita params xq se traen todos
    {
        return $this->createQueryBuilder('post')
            /*si ponemos solo post nos trae todos los datos de post, pero si ponemos campos, nos trae estos en especifico
            el user.id se llamara igual que post.id, osea id, por eso tenemos que ponerle un alias con "AS"*/
            ->select('post.id, post.title, post.description, post.file, post.creation_date, post.url, user.id AS user_id, user.email AS user_username')
            ->join('post.user', 'user') //acced al user del post y le ponemos el alias user, con esto podemos traer los atri del user. Se elimina tmb por el paginador
            ->orderBy('post.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Post[] Returns an array of Post objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Post
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

/*
*------------------------------------------------------------------------------------------------------------------------------------
*Instalacion
Usamos Scoop, un gestor de paquetes para Windows, para instalar Symfony CLI.
Scoop facilita la instalación de herramientas y programas desde la línea de comandos, gestionando las dependencias y actualizaciones.
Aquí están los pasos para instalar Symfony CLI usando Scoop:

*1. Instala Scoop (si aún no está instalado):
• Primero, necesitas asegurarte de que PowerShell 5 (o posterior) y .NET Framework 4.5 (o posterior) están instalados en tu máquina.
• Abre PowerShell y ejecuta el siguiente comando para instalar Scoop:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
iwr -useb get.scoop.sh | iex

• Este comando configurará tu política de ejecución para permitir scripts y luego instalará Scoop.

*2. Instala Symfony CLI:
• Una vez instalado Scoop, puedes instalar Symfony CLI ejecutando el siguiente comando en PowerShell:

scoop install symfony-cli

Scoop descargará y configurará Symfony CLI automáticamente.

*3. Verifica la Instalación:
• Para comprobar que Symfony CLI está correctamente instalado, ejecuta:

symfony
Esto debería mostrar la versión de Symfony CLI y las opciones de comandos disponibles.

*4. Actualizaciones:
• Para actualizar Symfony CLI en el futuro, simplemente puedes ejecutar:

scoop update symfony-cli
Usar Scoop para manejar las herramientas de desarrollo en Windows es bastante práctico, ya que maneja automáticamente las rutas y las actualizaciones, simplificando el mantenimiento de tus herramientas.

Para crear una aplicación web tradicional:
symfony new --webapp my_project

Si está creando un microservicio , una aplicación de consola o una API:
symfony new my_project

*Estructura de archivos y carpetas
Las tres carpetas principales de symfony son: public, src, templates.
Con estas 3 son las que vamos a interactuar el mayor tiempo de implementacion de nuestro codigo.
Estas 3 corresponden a los archivos publicos, a todos los assets, pueden ser las img, los css, los doc que las personas suban al proyecto.
Los controladores, la parte logica, las consultas a la base, todo eso se configura en la carpeta src, dentro de src esta Controller, alli iran
to dos los controladores que creemos para la plataforma. En Entity iran las entidades, que basicamente son las tablas de la base de datos. En repository
iran las consultas que podemos realizar a la base. En templates van las plantillas, aqui symfony usa "twig" que es una herramienta que nos ayuda a escribir
php con html de una forma muy bonita y muy divertida.
En la carpeta assets hay js, estilos y controladores, y esto es xq symfony v6 usa webpack encore, esto es bastante util para gestionar las dependencias de los
assets en el proyecto.
En la carpeta bin hay un archivo php de consola que podemos usar para ejecutar los comandos de symfony.
En la carpeta config estan las configuraciones del proyecto.
Nos saltamos la carpeta migrations por el momento.
En la carpeta var se guarda la cache y los logs. Los logs son los registros de todo lo que esta pasando en nuestro sistema, nos dira el estado de las peticiones php, el codigo
respuesta del server, y la cache se usa para no tener que repetir procesos.
En la carpeta vendor. Si se elimina todo el proyecto se daña, pero se puede regenerar gracias a composer
El archivo .env es un archivo de parametrizacion, osea vamos a poner los parametros o datos que son sensibles que pueden comprometer la seguridad del sistema, como la url de la base; como este archivo
es tan importante tenemos que tomar en cuenta que el archivo tiene que ser ignorado, osea hay que agregarlo en el gitignore para que no se vaya a subir al repositorio de git, con eso ya no estara agregado
al stage de git.
symfony usa git, y crea un git init cuando inicializamos un proyecto
symfony serve //para activar el server
*------------------------------------------------------------------------------------------------------------------------------------
*Que es composer
Es un gestor de dependencias, osea nos permite descargar codigo de otras personas e incorporarlo en nuestro proyecto, osea para no reinventar la rueda.
Ej: un sistema de inicio de sesion, hay dos opciones, la 1° es crear manualmente todo lo que corresponde al inicio de sesion, el form de registro, controladores, asegurarte del firewall, de toda la config de seguridad, etc.
la 2° opcion es utilizar el trabajo que alguien mas hizo e configurarlo e utilizarlo en el proyecto.
La gran mayoria de servers y proye web usan composer hoy en dia, por eso es una herramienta bastante confiable.
composer usa 2 archivos: composer.json: es un archivo json donde hay una parte que dice "require", todo lo que esta alli dentro son los repositorios que tiene symfony para que nosotros podamos ponerlos en nuestro proye, osea es
codigo de terceros que esta en nuestro proye, todos estos estan en la carpeta vendor, osea todo lo que esta en "require" esta en la carpeta vendor. El comando composer install lee este archivo json, se va a la seccion require
e instala todos los modulos y los almacena en vendor y mientras ejecuta el comando, el esta escribiendo un archivo que se llama composer.lock este es muy importante xq contiene las versiones exactas del modulo que se descargo, de tal
manera que si en un futuro una persona necesita exactamente el mismo cosigo que yo, solo le paso el composer .json y .lock y de esta forma cuando otro usuario ejec el composer install se descargaran las mismas ver que yo descargue, con
eso se asegura que los dos tenemos la misma version.
Si eliminamos vendor y ejecutamos el comando no leera el com .json xq ya tengo el com .lock, ya el lock sabe que ver descargar, osea lee el com .lock e instala las ver exactas que habia instal previamn y se regenera el vendor de nuevo.
*------------------------------------------------------------------------------------------------------------------------------------
*Entidades y bases de datos
Creamos el usuario y contra. Estos datos los pondremos en el doc .env
MariaDB [(none)]> CREATE USER 'symfony-admin'@'localhost' IDENTIFIED BY '123';

Le damos todos los privilegios
MariaDB [(none)]> GRANT ALL PRIVILEGES ON *.* TO 'symfony-admin'@'localhost' WITH GRANT OPTION;
Guardamos los cambios
MariaDB [(none)]> FLUSH PRIVILEGES;
la carpeta bin tiene un doc console, alli podemos ejecu los comandos symfony
Nos da una lista de los comandos disponibles para nuestra app
PS C:\xampp\htdocs\frikyland> php bin/console
el orm que usa symfony para las bases es doctrine.

*Doctrine nos da un comando para crear una base. Este lo buscamos en la lista en el cmd
PS C:\xampp\htdocs\frikyland> php bin/console doctrine:database:create

*Para eliminar la base. Nos dara un msj de advertencia si de verdad la queremos eliminar
PS C:\xampp\htdocs\frikyland> php bin/console doctrine:database:drop
Confirmamos la eliminacion con --force. Con --force obligamos al que el comando se ejec
PS C:\xampp\htdocs\frikyland> php bin/console doctrine:database:drop --force
El modelo entidad-relacion tiene 3 tablas: usuario, post, interaccion; el usuario puede hacer muchos post, un post puede tener muchas interaccciones, y un usuario puede tener muchas interaccciones de un post especifico

Hay una herramienta maker bundle, nos permite crear forms, controladores, entidades, etc.
PS C:\xampp\htdocs\frikyland> php bin/console make:user //para crear una entidad usuario

 The name of the security user class (e.g. User) [User]: //Como quieres que se llame la entidad usuario
 > User

 Do you want to store user data in the database (via Doctrine)? (yes/no) [yes]: //quieres almacenar los datos via Doctrine
 > y

 Enter a property name that will be the unique "display" name for the user (e.g. email, username, uuid) [email]: //ingresa un nombre para mostrar al usuario (al dar solo enter elige el email)
 >

 Will this app need to hash/check user passwords? Choose No if passwords are not needed or will be checked/hashed by some other system (e.g. a single sign-on server).

 Does this app need to hash/check user passwords? (yes/no) [yes]: //que si queremos que encripte las contras
 > y

 created: src/Entity/User.php //ya se ha creado la entidad usuario
 created: src/Repository/UserRepository.php //se crea el archivo para consultar dicha tabla
 updated: src/Entity/User.php
 updated: config/packages/security.yaml

La tabla esta bien, pero nos faltan campos. Cuando queremos crear una tabla que ya existe symfony no la sobreescribe si no que nos permite add mas campos

Agregamos mas campos
PS C:\xampp\htdocs\frikyland> php bin/console make:entity //para actualizar la tabla

 Class name of the entity to create or update (e.g. TinyElephant): //el nombre de la tabla a la que se quiere creaar o actualizar
 > User

 Your entity already exists! So let's add some new fields!

 New property name (press <return> to stop adding fields): //ponemos el nombre del nuevo campo
 > photo

 Field type (enter ? to see all types) [string]: //le decimos el tipo (si damos enter se pone como str)
 >

 Field length [255]: //tamaño del campo (si damos enter se pone en 255)
 >

 Can this field be null in the database (nullable) (yes/no) [no]: //ponemos que "si" puede ser nulo
 > yes

 updated: src/Entity/User.php //se actualizo la tabla

 Add another property? Enter the property name (or press <return> to stop adding fields): //add otro campo
 > description

 Field type (enter ? to see all types) [string]: //la diferencia entre text y str es que text no tiene longitud predeterminada, es tan largo como quieras que sea
 > text

 Can this field be null in the database (nullable) (yes/no) [no]: //le ponemos que "si" sera nulo
 > yes

 updated: src/Entity/User.php

 Add another property? Enter the property name (or press <return> to stop adding fields): //le damos enter xq ya no add mas campos
 >

Cuando usamos make:user, symfony sabe que la tabla usuario es para el login, diferenciar una entidad de user con el resto de entidades,
a traves del comando make:user xq este hace toda la confi y hace preguntas como preguntar a la base sobre la contra, que si queremos encriparla
y esto es importante xq toda esa config la hace make:user, si queremos cualquier otra entidad se usa make:entity, pero si es una entidad de tipo usuario
la hacemos con make:user

PS C:\xampp\htdocs\frikyland> php bin/console make:entity Post //creamos y ponemos el nombre de un solo a la tabla
 created: src/Entity/Post.php
 created: src/Repository/PostRepository.php

 Entity generated! Now let's add some fields!
 You can always add more fields later manually or by re-running this command.

 New property name (press <return> to stop adding fields): //creamos el campo
 > title

 Field type (enter ? to see all types) [string]: //que sea str
 >

 Field length [255]: //de 255
 >

 Can this field be null in the database (nullable) (yes/no) [no]: //que no sea null
 > no

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > type

 Field type (enter ? to see all types) [string]:
 >

 Field length [255]:
 >

 Can this field be null in the database (nullable) (yes/no) [no]:
 > no

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > description

 Field type (enter ? to see all types) [string]:
 > text

 Can this field be null in the database (nullable) (yes/no) [no]:
 > no

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > file

 Field type (enter ? to see all types) [string]:
 >

 Field length [255]:
 >

 Can this field be null in the database (nullable) (yes/no) [no]:
 > yes

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > creation_date

 Field type (enter ? to see all types) [string]: //poneomos un "?" para que nos diga los tipos disponibles
 > ?

 Field type (enter ? to see all types) [string]:
 > datetime

 Can this field be null in the database (nullable) (yes/no) [no]:
 > no

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > url

 Field type (enter ? to see all types) [string]:
 >

 Field length [255]:
 >

 Can this field be null in the database (nullable) (yes/no) [no]:
 > no

 updated: src/Entity/Post.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 >

  Success!

 Next: When you're ready, create a migration with php bin/console make:migration

PS C:\xampp\htdocs\frikyland> php bin/console make:entity Interaction
 created: src/Entity/Interaction.php
 created: src/Repository/InteractionRepository.php

 Entity generated! Now let's add some fields!
 You can always add more fields later manually or by re-running this command.

 New property name (press <return> to stop adding fields):
 > user_favorite

 Field type (enter ? to see all types) [string]:
 > boolean

 Can this field be null in the database (nullable) (yes/no) [no]:
 > yes

 updated: src/Entity/Interaction.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > comment

 Field type (enter ? to see all types) [string]:
 > text

 Can this field be null in the database (nullable) (yes/no) [no]:
 > no

 updated: src/Entity/Interaction.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 >
  Success!

Ahora ya tenemos las tablas, pero no estan relacionadas, xq user y post id representan la relacion en las tablas, esto es una relacion binaria, no logica.
La idea es que un usuario puede escribir muchos post, osea una relacion de uno a muchos, pero desde la perspectiva de los post, un post puede ser escrito por
un user, pero tmb muchos post pueden ser escritos por un usuario, osea es una relacion de muchos a uno, es de que forma se vea mas facil. Otra forma es: de muchos
a uno, un user puede tener muchos post y un post puede tener muchas interaccciones, que a su ves esas interaccciones pueden ser escritas por un user

PS C:\xampp\htdocs\frikyland> php bin/console make:entity User //abrimos user xq un user puede tener varios post
 Your entity already exists! So let's add some new fields!

 New property name (press <return> to stop adding fields): //add un campo nuevo
 > posts

 Field type (enter ? to see all types) [string]: //que tipo de relacion es? Es de un user puede tener muchos posts, osea uno a muchos (OneToMany)
 > OneToMany

 What class should this entity be related to?: //con que entidad esta relacionado? Esta relacionado con Post
 > Post

 A new property will also be added to the Post class so that you can access and set the related User object from it.

 New field name inside Post [user]: //dentro de post, como se llamara la relacion? Damos enter y se llamara User
 >

 Is the Post.user property allowed to be null (nullable)? (yes/no) [yes]: //no me parece que un post no tenga un user asignado, le ponemos que no debe ser nulo
 > no

 Do you want to activate orphanRemoval on your relationship?
 A Post is "orphaned" when it is removed from its related User.
 e.g. $user->removePost($post)

 NOTE: If a Post may *change* from one User to another, answer "no".

 Do you want to automatically delete orphaned App\Entity\Post objects (orphanRemoval)? (yes/no) [no]: //un post pertenece a un user, si ese user se elimina, el post queda huerfano, aca me preguntan que hago cuando no existe un user, elimino los post huerfanos? Le damos que si, que los elimine
 > yes

 updated: src/Entity/User.php //Ya tenemos la relacion de user a post
 updated: src/Entity/Post.php

//Un usuario a interacciones, un user puede tener muchas interaccciones
 Add another property? Enter the property name (or press <return> to stop adding fields): //add el campo de interaccciones
 > interactions

 Field type (enter ? to see all types) [string]: //le decimos que uno a muchos, xq un user puede tener muchas interaccciones
 > OneToMany

 What class should this entity be related to?: //La entidad esta relacionada con Interaction
 > Interaction

 A new property will also be added to the Interaction class so that you can access and set the related User object from it.

 New field name inside Interaction [user]: //la entidad dentro de Interaction se llamara user
 >

 Is the Interaction.user property allowed to be null (nullable)? (yes/no) [yes]: //no debe ser nulo xq una interaccion debe pertenecer a un user
 > no

 Do you want to activate orphanRemoval on your relationship?
 A Interaction is "orphaned" when it is removed from its related User.
 e.g. $user->removeInteraction($interaction)

 NOTE: If a Interaction may *change* from one User to another, answer "no".

 Do you want to automatically delete orphaned App\Entity\Interaction objects (orphanRemoval)? (yes/no) [no]: //si eliminamos el user, que se eliminen las interaccciones huerfanas
 > yes

 updated: src/Entity/User.php //ya tenemos la relacion de user a interaction
 updated: src/Entity/Interaction.php

*relacion de post con interaccion
PS C:\xampp\htdocs\frikyland> php bin/console make:entity Post //abrimos la entidad Post
 Your entity already exists! So let's add some new fields!

 New property name (press <return> to stop adding fields): //add nuevo campo
 > interactions

 Field type (enter ? to see all types) [string]: //de uno a muchos xq un user puede tener muchas interaccciones
 > OneToMany

 What class should this entity be related to?: //esta entidad esta relacionada con la tabla Interaction
 > Interaction

 A new property will also be added to the Interaction class so that you can access and set the related Post object from it.

 New field name inside Interaction [post]: //la entidad dentro de interaccion se llamara post
 >

 Is the Interaction.post property allowed to be null (nullable)? (yes/no) [yes]: //no debe ser nulo xq la interaccion debe pertencer a un user
 > no

 Do you want to activate orphanRemoval on your relationship?
 A Interaction is "orphaned" when it is removed from its related Post.
 e.g. $post->removeInteraction($interaction)

 NOTE: If a Interaction may *change* from one Post to another, answer "no".

 Do you want to automatically delete orphaned App\Entity\Interaction objects (orphanRemoval)? (yes/no) [no]: //si se eliminan las interaccciones al eliminar un user
 > yes

 updated: src/Entity/Post.php //ya tenemos la relacion de post e interaccion
 updated: src/Entity/Interaction.php

//en el proyecto ya tengo las entidades, campos, relaciones, pero no la tengo en la base, para pasarlos se hace con el siguiente comando:
//se actualiza el esquema y en la base ya existe la relacion. Este cambio lo podemos ver en phpMyAdmin
PS C:\xampp\htdocs\frikyland> php bin/console doctrine:schema:update --force

 Updating database schema...

     7 queries were executed


 [OK] Database schema updated successfully!
------------------------------------------------------------------------------------------------------------------------------------
//Usamos el comando del maker bundle para crear nuestro primer controlador
C:\xampp\htdocs\frikyland>php bin/console make:controller

 Choose a name for your controller class (e.g. OrangePizzaController): //usamos la notacion del ejemplo, cada palabra en mayusculas, y por ultimo ponemos Controller
 > PostController

 created: src/Controller/PostController.php //se crea el controlador "PostController"
 created: templates/post/index.html.twig //tmb se crea un archivo en la carpeta template, carpeta post y el doc es index.html.twig
  Success!
 Next: Open your new controller class and add some pages!
------------------------------------------------------------------------------------------------------------------------------------
*Metodos magicos de symfony: consisten en metodos de consulta a la base
find(): este metodo busca por id
findAll(): este metodo busca todos los objs dependiendo del param que le pasen
findBy(): este metodo busca uno o varios objs dependiendo de los param que le pasen
findOneBy(): este metodo busca un obj dependiendo de los param que le pasen, es como findBy() pero solo regresa un obj

$post = $this->em->getRepository(Post::class)->find($id);
$posts = $this->em->getRepository(Post::class)->findAll($id);
$posts = $this->em->getRepository(Post::class)->findBy(['id' => 1, 'title' => 'Mi primer post de prueba']);
$post = $this->em->getRepository(Post::class)->findOneBy(['id' => 1]);
------------------------------------------------------------------------------------------------------------------------------------
C:\xampp\htdocs\frikyland>php bin/console make:form //creamos un form

 The name of the form class (e.g. TinyPizzaType): //ponemos el nombre del form con la primera letra en mayus y symf pone el Type al final
 > Post

 The name of Entity or fully qualified model class name that the new form will be bound to (empty for none): //le ponemos que el form estara relacionado con la entidad Post
 > Post

 created: src/Form/PostType.php //ya se creo el form
  Success!

 Next: Add fields to your form and start using it.
 Find the documentation at https://symfony.com/doc/current/forms.html

https://symfony.com/doc/current/reference/forms/types.html //tipos de campos que se pueden poner en los forms
------------------------------------------------------------------------------------------------------------------------------------
C:\xampp\htdocs\frikyland>php bin/console make:controller UserController //creamos un ctrl para el usuario
 created: src/Controller/UserController.php //se crea el ctrl del user
 created: templates/user/index.html.twig //se crea un index del ctrl del user
------------------------------------------------------------------------------------------------------------------------------------
C:\xampp\htdocs\frikyland>php bin/console make:form UserType //creamos un form para registro de users

 The name of Entity or fully qualified model class name that the new form will be bound to (empty for none): //le ponemos que este relacionado con la entidad user
 > User
 created: src/Form/UserType.php //se crea el form de user
------------------------------------------------------------------------------------------------------------------------------------
*Creamos un ctrl de login
C:\xampp\htdocs\frikyland>php bin/console make:controller Login
 created: src/Controller/LoginController.php
 created: templates/login/index.html.twig
------------------------------------------------------------------------------------------------------------------------------------
*/

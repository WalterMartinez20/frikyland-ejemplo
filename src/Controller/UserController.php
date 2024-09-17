<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    private $em;
    /**
     * @param $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em; //creamos el em para que nos persista el user
    }

    #[Route('/registration', name: 'userRegistration')]
    //con UserPasswordHasherInterface encriptamos la contra
    public function userRegistration(Request $request, UserPasswordHasherInterface $passwordHasher): Response //el nombre de la ruta se pone como el nombre de la fun. Siempre ponemos el request
    {
        $user = new User(); //creamos un nuevo user
        $registration_form = $this->createForm(UserType::class, $user); //renderizamos y asignamos el user
        $registration_form->handleRequest($request);
        if ($registration_form->isSubmitted() && $registration_form->isValid()) {
            $plaintextPassword = $registration_form->get('password')->getData(); //obtenemos la contra usando el campo password
            $hashedPassword = $passwordHasher->hashPassword( //encriptamos la contra, para esto necesitamos el user y la contra plana
                $user,
                $plaintextPassword
            );
            $user->setPassword($hashedPassword); //editamos la contra y ya no se guardara como plano, si no que encrip
            //to dos los que se registren tendran el rol de user, si quiero un admin ponemos 'ROLE_ADMIN', se puede buscar en symf cuantos roles hay
            $user->setRoles(['ROLE_USER']);
            $this->em->persist($user);
            $this->em->flush();
            return $this->redirectToRoute('userRegistration');
            //este ej esta bien, solo que al registrar no se encripta la contra y deja vacio el rol
        }
        return $this->render('user/index.html.twig', [
            //pasamos el form al twig
            'registration_form' => $registration_form->createView()
        ]);
    }
}
/**
 *
 * todo Para registrar usuarios Symfony recomienda emplear este comando: make:registration-form. Con ese comando se crea el controlador para el registro, el formulario, y la posibilidad de hacer verificación a través de email.
 */

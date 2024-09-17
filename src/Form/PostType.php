<?php

namespace App\Form;

use App\Entity\Post;
use PHPUnit\TextUI\XmlConfiguration\File;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        /*
        *Formularios:hemos manipulado la base con ctrls directos, pero que pasa cuando necesitamos que un registro sea guardado por un form, eso se puede hacer con symfony
        cuando relacionamos el form con la entidad post, este trajo todos los atri y los guardo
        y los puso aca.
        Al registrarse y darle al submit da err xq no le estamos pasando un user, y el user no se puede poner en el form xq es delicado en la parte
        de la seguridad, mejor se le pasa el user desde el ctrl
        */
        $builder
            ->add('title') //cada uno de estos es un campo, que son los mismos que los atri de la entidad
            ->add('type', ChoiceType::class, [
                //cambiamos el tipo por una lista de vals (ChoiceType). Los vals de la lista los creamos en la entidad Post por buenas practicas
                'choices' => Post::TYPES
            ])
            ->add('description')
            ->add('file', FileType::class, [
                'label' => 'photo',
                'required' => false,
                //los campos de constraints no se han puesto xq daban error. https://symfony.com/doc/current/controller/upload_file.html
            ])

            // ->add('creation_date', null, [ //fecha y la url se quitan xq tienen que ponerse automaticam al enviarse el form
            //     'widget' => 'single_text',
            // ])
            // ->add('url')
            ->add('submit', SubmitType::class);

        // ->add('user', EntityType::class, [ //eliminamos este campo y creamos submit
        //     'class' => User::class,
        //     'choice_label' => 'id',
        // ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Post::class,
        ]);
    }
}

<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Permission;
use SilverStripe\Versioned\Versioned;

class Config
{
    use Configurable;

    private static $tinymce = [
        'all' => [
            'menubar' => false,
            'inline' => true,
            'noneditable_noneditable_class' => 'noneditable'
        ],
        'text' => [
            'plugins' => ['charmap', 'noneditable'],
            'toolbar' => ['undo', 'redo', '|', 'charmap'],
            'valid_elements' => ['ss-freedom-shortcode[class|tag|title]'],
            'valid_styles' => []
        ],
        'html' => [
            'plugins' => ['charmap', 'lists', 'noneditable', 'link'],
            'toolbar' => ['undo', 'redo', '|', 'styleselect', '|', 'bold', 'italic', '|', 'link', 'unlink', '|', 'numlist', 'bullist', 'charmap', '|', 'elementoptions'],
            'valid_elements' => [
                'p', 'br', 'strong/b', 'em/i', 'ul', 'ol', 'li', 'a[href|target|rel]', 'ss-freedom-shortcode[class|tag|title]'
            ],
            'valid_styles' => []
        ]
    ];

    public static function getTinyMceConfigJson()
    {
        $config = singleton(__CLASS__)->config();
        return json_encode($config->get('tinymce'));
    }

    public static function isWidgetActive(DataObject $object = null)
    {
        $currentRequest = Controller::has_curr() ? Controller::curr()->getRequest() : null;

        $isStaticPublishing = $currentRequest ?
            stristr($currentRequest->getHeader('User-Agent'), 'staticpublish') : false;

        $isInCms = Controller::curr() instanceof LeftAndMain;

        return !$isStaticPublishing && !$isInCms &&
            Permission::check('NIKROLLS_SSFREEDOM_EDIT') &&
            (!$object || $object->canEdit());
    }

    public static function isAugmentationActive(DataObject $object = null)
    {
        $isWidgetActive = static::isWidgetActive($object);
        $isInStageMode = Versioned::get_stage() !== 'Live';
        return $isWidgetActive && $isInStageMode;
    }
}

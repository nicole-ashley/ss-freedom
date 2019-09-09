<?php

namespace NikRolls\SsFreedom;

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
            'inline' => true
        ],
        'text' => [
            'plugins' => ['charmap'],
            'toolbar' => 'undo redo | charmap',
            'valid_elements' => '',
            'valid_styles' => []
        ],
        'html' => [
            'plugins' => ['charmap', 'lists'],
            'toolbar' => 'undo redo | styleselect | bold italic | numlist bullist charmap | elementoptions',
            'valid_elements' => 'p,br,strong/b,em/i,ul,ol,li,a',
            'valid_styles' => []
        ]
    ];

    public static function getTinyMceConfigJson()
    {
        $config = singleton(__CLASS__)->config();
        return json_encode($config->get('tinymce'));
    }

    public static function isActive(DataObject $object = null)
    {
        $currentRequest = Controller::has_curr() ? Controller::curr()->getRequest() : null;

        $isStaticPublishing = $currentRequest ?
            stristr($currentRequest->getHeader('User-Agent'), 'staticpublish') : false;

        $isInLiveMode = Versioned::get_stage() === 'Live';

        return !$isStaticPublishing && !$isInLiveMode &&
            Permission::check('NIKROLLS_SSFREEDOM_EDIT') &&
            $object && $object->canEdit();
    }
}

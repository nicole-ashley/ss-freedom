<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Core\Config\Configurable;

class Config
{
    use Configurable;

    private static $tinymce = [
        'all' => [
            'menubar' => false,
            'inline' => true
        ],
        'text' => [
            'plugins' => ['charmap', 'tinymcespellchecker'],
            'toolbar' => 'undo redo | charmap',
            'valid_elements' => '',
            'valid_styles' => []
        ],
        'html' => [
            'plugins' => ['charmap', 'lists', 'tinymcespellchecker'],
            'toolbar' => 'undo redo | styleselect | bold italic | numlist bullist charmap | classselectionoptions',
            'valid_elements' => 'p,br,strong/b,em/i,ul,ol,li,a',
            'valid_styles' => []
        ]
    ];

    public static function getTinyMceConfigJson()
    {
        $config = singleton(__CLASS__)->config();
        return json_encode($config->get('tinymce'));
    }
}

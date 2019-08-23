<?php

namespace NikRolls\SsFreedom;

use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

/**
 * @property ContentController owner
 */
class ContentControllerExtension extends Extension
{
    public function onAfterInit()
    {
        if (Config::isActive($this->owner->data())) {
            $tinyMceConfigJson = Config::getTinyMceConfigJson();
            Requirements::javascript('https://cdn.tiny.cloud/1/r4pfhqlr332mbvsv29yduo7z8pybq7bkueg1x25hienr70xv/tinymce/5/tinymce.min.js');
            Requirements::javascript('https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js');
            Requirements::javascript('nikrolls/ss-freedom: javascript/www/build/ss-freedom.js', ['async']);
            Requirements::css('nikrolls/ss-freedom: javascript/www/build/ss-freedom.css');
            Requirements::customScript("
                window.NikRolls = window.NikRolls || {};
                window.NikRolls.SsFreedom = {
                  configurations: {$tinyMceConfigJson}
                };                
                document.body.appendChild(document.createElement('ss-freedom-admin-widget'))
            ");
        }
    }
}

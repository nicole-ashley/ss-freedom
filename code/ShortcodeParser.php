<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Core\Convert;

class ShortcodeParser extends \SilverStripe\View\Parsers\ShortcodeParser
{
    public function getShortcodeReplacementText($tag, $extra = [], $isHTMLAllowed = true)
    {
        if (!Config::isActive()) {
            return parent::getShortcodeReplacementText($tag, $extra = [], $isHTMLAllowed);
        }

        $content = $this->callShortcode($tag['open'], $tag['attrs'], $tag['content'], $extra);

        if ($content !== false && $isHTMLAllowed) {
            $attrSafeTag = Convert::raw2att($tag['text']);
            return "<ss-freedom-shortcode class='noneditable' tag='$attrSafeTag' title='$attrSafeTag'>$content</ss-freedom-shortcode>";
        } else {
            return $tag['text'];
        }
    }
}

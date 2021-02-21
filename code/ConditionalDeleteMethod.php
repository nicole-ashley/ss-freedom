<?php

namespace NikRolls\SsFreedom;

interface ConditionalDeleteMethod
{
    /** @return string 'delete' or 'unlink' */
    public function getFreedomDeleteMethod(): ?string;
}

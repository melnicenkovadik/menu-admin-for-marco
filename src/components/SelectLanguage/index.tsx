'use client'
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import useTranslation from "../../hooks/useTranslation";
import {useRouter} from "next/router";

export default function SelectLanguage() {
    const {setLocale, locales} = useTranslation();
    const {asPath, pathname, push, route} = useRouter();
    const currentLocale = locales.find((locale) => locale === asPath.split("/")[1]) || "en";

    function handleLocaleChange(language: string) {
        if (!window) {
            return;
        }
        if (language === currentLocale) return;

        const regex = new RegExp(`^/(${locales.join("|")})`);
        localStorage.setItem("lang", language);
        setLocale(language);

        if (!route.includes("post/")) {
            push(pathname, asPath.replace(regex, `/${language}`));
        }
    }

    return (
        <Dropdown backdrop="blur"
                  placement="bottom-end"
        >
            <DropdownTrigger>
                <Button
                    variant="bordered"
                >
                    {currentLocale?.toUpperCase()}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                variant="faded"
                aria-label="Select language"
            >
                {locales?.map((locale) => (
                    <DropdownItem
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        color={locale === currentLocale ? "primary" : undefined}
                        endContent={locale === currentLocale ? <div className='check'/> : undefined}
                    >
                        {locale?.toUpperCase()}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

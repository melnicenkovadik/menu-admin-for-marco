"use client";
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar} from "@nextui-org/react";
import useTranslation from "../../hooks/useTranslation";
import {useRouter} from "next/router";

export default function SelectLanguage() {
    const {setLocale, locales,locale} = useTranslation();
    const {asPath, pathname, push, route} = useRouter();
    const currentLocale = locale

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
                    isIconOnly color="warning" variant="faded" aria-label="Take a photo"
                >
                    {/*{currentLocale?.toUpperCase()}*/}
                    <Avatar
                        alt={currentLocale}
                        className="d-inline-block w-6 h-6"
                        src={`https://flagcdn.com/${
                            currentLocale === "en" ? "us" : currentLocale
                        }.svg`}
                    />
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
                        // color={locale === currentLocale ? "primary" : undefined}
                        endContent={
                            <Avatar
                                alt={locale}
                                className="w-6 h-6"
                                src={`https://flagcdn.com/${
                                    locale === "en" ? "us" : locale
                                }.svg`}
                            />
                        }
                    >
                        {
                            locale === "en" ? "English" : locale === "ua" ? "Українська" : locale === "it" ? "Italiano" : "Русский"
                        }
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

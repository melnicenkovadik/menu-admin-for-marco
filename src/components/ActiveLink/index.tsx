import {cloneElement, ReactElement} from "react";
import {useRouter} from "next/router";
import Link, {LinkProps} from "next/link";

type ActiveLinkProps = LinkProps & {
    children: ReactElement | ReactElement[] | string;
    activeClassName: string;
};

export function ActiveLink({
                               children,
                               activeClassName,
                               ...rest
                           }: ActiveLinkProps) {
    const {asPath} = useRouter();
    const className = asPath === rest.href
          ? activeClassName
            : '';

    // @ts-ignore
    const child = cloneElement(children, {
        className,
    });


    return <Link {...rest}>
        {child}
    </Link>;
}

import Link from "next/link";

interface Props {
    href: string;
    children: React.ReactNode;
    className: string;
}

export function NavigationButton({href, children, className}: Props) {
    return(
        <>
            <Link href={href}>
              <button className={className}>
                {children}
              </button>
            </Link>
        </>
    );
}
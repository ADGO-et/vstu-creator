import { useEffect } from "react";
import { IconType } from "react-icons/lib";
import { Link, useNavigate } from "react-router-dom";

interface MobileNavMenuLink {
  title: string;
  to: string;
  Icon?: IconType;
  nestLevel?: number;
}

export default function MobileNavMenu({
  title,
  links,
}: {
  title: string;
  links: MobileNavMenuLink[];
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const isSmall = window.innerWidth < 640;
    if (!isSmall) navigate(links[0].to);
  }, []);

  return (
    <div>
      <h1 className="text-4xl pb-6">{title}</h1>

      <div className="sm:hidden flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              style={{ marginLeft: `${(link.nestLevel || 0) * 2.5}rem` }}
              className="flex gap-2 items-center border border-foreground/20 bg-muted p-3 pl-6 rounded-md"
            >
              {link.Icon && <link.Icon />}
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

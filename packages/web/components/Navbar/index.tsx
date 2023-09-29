import DocsLink from "@components/links/DocsLink";
import Link from "@components/links/Link";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import Btn from "../Btn";
import css from "./index.module.css";

// Used in WorkbenchLayout
export default function Navbar() {
  return (
    <div className={css.container}>
      <div className={css.inner}>
        <div className={css.left}>
          <DocsLink className={css.link}>Dolt Documentation</DocsLink>
        </div>

        <div>
          <Link
            href="/"
            className={css.workbenchLogoLink}
            data-cy="navbar-workbench-logo"
          >
            <img
              src="/images/hosted-workbench-logo.png"
              alt="Hosted Dolt Workbench"
            />
          </Link>
        </div>

        <div className={css.right}>
          <Link href="/" className={css.exit}>
            <Btn>
              Exit
              <span className={css.closeIcon}>
                <AiOutlineClose />
              </span>
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}
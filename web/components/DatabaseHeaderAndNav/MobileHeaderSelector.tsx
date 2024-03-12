import { FormSelect, FormSelectTypes } from "@dolthub/react-components";
import useDatabaseDetails from "@hooks/useDatabaseDetails";
import {
  getDatabasePageName,
  getDatabasePageRedirectInfo,
} from "@lib/mobileUtils";
import { OptionalRefParams } from "@lib/params";
import { useRouter } from "next/router";
import css from "./index.module.css";

type Props = {
  params: OptionalRefParams;
  title?: string;
};

const getTabOptions = (
  isDolt: boolean,
  hideDoltFeature: boolean,
): FormSelectTypes.Option[] => {
  if (hideDoltFeature) return [{ value: "ref", label: "Database" }];
  return [
    { value: "ref", label: "Database" },
    { value: "about", label: "About", isDisabled: !isDolt },
    { value: "commitLog", label: "Commit Log", isDisabled: !isDolt },
    { value: "releases", label: "Releases", isDisabled: !isDolt },
    { value: "pulls", label: "Pull Requests", isDisabled: !isDolt },
  ];
};

export default function MobileHeaderSelector(props: Props) {
  const res = useDatabaseDetails();
  const router = useRouter();

  const handleChangeTab = (pageName: string) => {
    const { href, as } = getDatabasePageRedirectInfo(pageName, props.params);
    router.push(href, as).catch(console.error);
  };
  const pageName = getDatabasePageName(props.title);

  return (
    <FormSelect
      onChangeValue={handleChangeTab}
      options={getTabOptions(res.isDolt, res.hideDoltFeature)}
      val={pageName}
      hideSelectedOptions
      outerClassName={css.mobileSelector}
      forMobile
    />
  );
}

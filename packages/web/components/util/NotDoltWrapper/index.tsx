import ErrorMsg from "@components/ErrorMsg";
import Loader from "@components/Loader";
import useIsDolt from "@hooks/useIsDolt";
import React, { ReactElement } from "react";
import NotDoltMsg from "./NotDoltMsg";

type Props = {
  children: ReactElement;
  showNotDoltMsg?: boolean;
  feature?: string;
  className?: string;
};

export default function NotDoltWrapper(props: Props) {
  const res = useIsDolt();
  if (res.loading) return <Loader loaded={false} />;
  if (res.error) return <ErrorMsg err={res.error} />;
  if (res.isDolt) {
    return props.children;
  }
  if (props.showNotDoltMsg) {
    return <NotDoltMsg feature={props.feature} className={props.className} />;
  }
  if (res.disableDoltFeature) {
    return React.cloneElement(props.children, { doltDisabled: true });
  }
  return <div />;
}
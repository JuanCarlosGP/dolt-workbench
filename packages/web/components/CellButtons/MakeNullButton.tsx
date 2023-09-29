import Button from "@components/Button";
import { useDataTableContext } from "@contexts/dataTable";
import { useSqlEditorContext } from "@contexts/sqleditor";
import {
  ColumnForDataTableFragment,
  RowForDataTableFragment,
} from "@gen/graphql-types";
import {
  getUpdateCellToNullQuery,
  mapQueryColsToAllCols,
} from "@lib/dataTable";
import { isUneditableDoltSystemTable } from "@lib/doltSystemTables";
import css from "./index.module.css";
import { pksAreShowing } from "./utils";

type Props = {
  currCol: ColumnForDataTableFragment;
  queryCols: ColumnForDataTableFragment[];
  row: RowForDataTableFragment;
  setQuery?: (s: string) => void;
  isNull: boolean;
  refName?: string;
};

export default function MakeNullButton(props: Props): JSX.Element | null {
  const { executeQuery, setEditorString } = useSqlEditorContext();
  const { params, columns } = useDataTableContext();
  const { tableName } = params;
  const notNullConstraint = !!props.currCol.constraints?.some(
    con => con.notNull,
  );

  if (
    !tableName ||
    isUneditableDoltSystemTable(tableName) ||
    !pksAreShowing(props.queryCols, columns)
  ) {
    return null;
  }

  const onClick = async () => {
    const query = getUpdateCellToNullQuery(
      tableName,
      props.currCol.name,
      mapQueryColsToAllCols(props.queryCols, columns),
      props.row,
    );
    if (props.setQuery) {
      props.setQuery(query);
    }
    setEditorString(query);
    await executeQuery({
      ...params,
      refName: props.refName ?? params.refName,
      query,
    });
  };

  return (
    <div>
      <Button.Link
        onClick={onClick}
        className={css.button}
        disabled={notNullConstraint || props.isNull}
      >
        Make NULL
      </Button.Link>
    </div>
  );
}
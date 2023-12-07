import { Field, ObjectType } from "@nestjs/graphql";
import * as columns from "../columns/column.model";
import { Column } from "../columns/column.model";
import { RawRow } from "../dataSources/types";
import * as row from "../rows/row.model";
import { ROW_LIMIT, getNextOffset } from "../utils";
import { ListOffsetRes } from "../utils/commonTypes";
import { DiffRowType } from "./rowDiff.enums";
import { canShowDroppedOrAddedRows } from "./utils";

@ObjectType()
export class RowDiff {
  @Field(_type => row.Row, { nullable: true })
  added?: row.Row;

  @Field(_type => row.Row, { nullable: true })
  deleted?: row.Row;
}

@ObjectType()
export class RowDiffList extends ListOffsetRes {
  @Field(_type => [RowDiff])
  list: RowDiff[];

  @Field(_type => [Column])
  columns: Column[];
}

@ObjectType()
export class RowListWithCols extends row.RowList {
  @Field(_type => [columns.Column])
  columns: columns.Column[];
}

export function fromRowDiffRowsWithCols(
  cols: Column[],
  diffs: RawRow[],
  offset: number,
): RowDiffList {
  const rowDiffsList: RowDiff[] = diffs.map(rd => {
    const addedVals: Array<string | null> = [];
    const deletedVals: Array<string | null> = [];
    cols.forEach(c => {
      addedVals.push(rd[`to_${c.name}`]);
      deletedVals.push(rd[`from_${c.name}`]);
    });

    return { added: getDiffRow(addedVals), deleted: getDiffRow(deletedVals) };
  });

  return {
    list: rowDiffsList.slice(0, ROW_LIMIT),
    nextOffset: getNextOffset(rowDiffsList.length, offset),
    columns: cols,
  };
}

export function fromDoltListRowWithColsRes(
  rows: RawRow[],
  cols: RawRow[],
  offset: number,
  tableName: string,
): RowListWithCols {
  return {
    list: rows.slice(0, ROW_LIMIT).map(row.fromDoltRowRes),
    nextOffset: getNextOffset(rows.length, offset),
    columns: cols.map(c => columns.fromDoltRowRes(c, tableName)),
  };
}

export function fromOneSidedTable(
  rows: RowListWithCols,
  type: "added" | "dropped",
  filter?: DiffRowType,
): RowDiffList {
  const emptyList = { list: [], columns: [] };
  if (!canShowDroppedOrAddedRows(type, filter)) {
    return emptyList;
  }
  return {
    list: rows.list.map(r =>
      type === "added" ? { added: r } : { deleted: r },
    ),
    nextOffset: rows.nextOffset,
    columns: rows.columns,
  };
}

function getDiffRow(
  vals: Array<string | null | undefined>,
): row.Row | undefined {
  if (vals.every(v => v === null || v === undefined)) return undefined;
  return {
    columnValues: vals.map(v => {
      return { displayValue: row.getCellValue(v) };
    }),
  };
}

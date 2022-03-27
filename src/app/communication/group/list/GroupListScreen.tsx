import React, { useEffect, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import TableRow from "@material-ui/core/TableRow";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../../constants";
import { ApiService, Communications } from "../../../../helpers";
import { AddRounded } from "@material-ui/icons";
import { Button, TablePagination, Tooltip } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import "./GroupListScreen.scss";
import { SearchRounded } from "@material-ui/icons";
import { TextField } from "@material-ui/core";
import NoDataCardComponent from "../../../../components/NoDataCardComponent";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useLocalStorage } from "../../../../components/useLocalStorage";

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#10c4d3",
      },
    },
  },
})(TextField);

const GroupListScreen = () => {
  const history = useHistory();
  const [list, setList] = React.useState<TsDataListState | null>(null);
  const [pageSizeIndex, setPageSizeIndex] = useLocalStorage<any>("groupListPageSizeIndex", 10);

  if (list?.table?.data) {
    list?.table?.data?.sort((a: any, b: any) => {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
  }

  const init = useCallback(() => {
    const options = new TsDataListOptions(
      {
        // @ts-ignore
        pagination: {
          ...list?.table?.pagination,
          pageSize: pageSizeIndex,
        },
        webMatColumns: ["Created On", "Group Name", "Total Members", "SMS Blast", "Actions"],
        mobileMatColumns: ["Created On", "Group Name", "Total Members", "SMS Blast", "Actions"],
      },
      ENV.API_URL + "group",
      setList,
      ApiService,
      "get"
    );

    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
    // eslint-disable-next-line
  }, []);

  const getList = useCallback(() => {
    if (!list) {
      init();
      return;
    }
    // eslint-disable-next-line
  }, [list]);

  const handleSmsBlast = (group: any) => {
    history.push({
      pathname: "/sendSmsBlast",
      state: group,
    });
  };

  useEffect(() => {
    getList();
    Communications.pageTitleSubject.next("Create Group");
    Communications.pageBackButtonSubject.next(null);
  }, [getList]);

  return (
    <>
      <div className={"group-add screen crud-layout pdd-30"}>
        {list && list.table?._isDataLoading && (
          <div className="table-loading-indicator">
            <LoaderComponent />
          </div>
        )}
        <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0 mrg-top-20">
          <div className="header">
            <div className="mrg-left-5 filter">
              <div>
                <div className="d-flex">
                  <div className="d-flex position-relative">
                    {!list?.table.filter.search ? (
                      <div className={"search_icon"}>
                        <SearchRounded />
                      </div>
                    ) : (
                      <div className={"search_icon"}>
                        <ClearIcon
                          onClick={(event) => {
                            if (list && list.table) {
                              list.table.filter.search = "";
                              list.table.reload();
                              // list?.table.pageEvent(0)
                            }
                          }}
                          id="clear_group_search"
                        />
                      </div>
                    )}
                    <div>
                      <CssTextField
                        defaultValue={""}
                        className="search-cursor searchField"
                        id="input_search_group"
                        onChange={(event) => {
                          if (list && list.table) {
                            list.table.filter.search = event.target.value;
                            list.table.reload();
                            // list?.table.pageEvent(0)
                          }
                        }}
                        value={list?.table.filter.search}
                        variant={"outlined"}
                        size={"small"}
                        type={"text"}
                        placeholder={"Search Group"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="action pdd-right-5">
              <div>
                <Tooltip title={"Create New Group"}>
                  <Button variant={"contained"} color={"primary"} component={Link} to={`/group/add`} id="btn-add-group">
                    <AddRounded />
                    &nbsp;&nbsp;Create New&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          {list && list.table && (
            <>
              <TableContainer component={Paper} className={"table-responsive"}>
                <Table stickyHeader className="mat-table table group-list-table">
                  <TableHead className={"mat-thead"}>
                    <TableRow className={"mat-tr"}>
                      {list?.table.matColumns.map((column: any, columnIndex: any) => (
                        <TableCell className={column === "Actions" ? "mat-th mat-th-sticky" : "mat-th"} key={"header-col-" + columnIndex}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody className={"mat-tbody"}>
                    {!list.table._isDataLoading && list.table?.data.length === 0 && <NoDataCardComponent tableCellCount={list.table.matColumns.length} />}
                    {list?.table.data.map((row: any, rowIndex: any) => {
                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={"row-" + rowIndex} className={"mat-tr"}>
                          <TableCell className="mat-td mat-td-created-at">{moment(row["created_at"])?.format("MM-DD-YYYY")}</TableCell>
                          <TableCell className="mat-td mat-td-title">{row["title"]}</TableCell>
                          <TableCell className="mat-td mat-td-members-count">{row["members_count"]}</TableCell>
                          <TableCell className="mat-td mat-td-sms-blast">
                            <Tooltip title={`Send SMS Blast to ${row["title"]}`}>
                              <div className="d-flex message-wrapper" onClick={() => handleSmsBlast(row)} id={"sms-blast_" + rowIndex}>
                                <QuestionAnswerIcon className={"sms-blast-icon"} /> &nbsp; <span className="sms-blast">SMS Blast</span>
                              </div>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="mat-td mat-td-sticky mat-td-actions">
                            <Tooltip title={`${row["title"]} view details`}>
                              <Link to={"/group/view/" + row._id} className="info-link" id={"link_group_details_" + rowIndex}>
                                {"View Details"}
                              </Link>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={list.table.pagination.pageSizeOptions}
                  component="div"
                  count={list?.table.pagination.totalItems}
                  rowsPerPage={list?.table.pagination.pageSize}
                  page={list?.table.pagination.pageIndex}
                  onPageChange={(event, page) => list.table.pageEvent(page)}
                  onRowsPerPageChange={(event) => {
                    setPageSizeIndex(event.target.value);
                    list.table?.pageEvent(0, +event.target.value);
                  }}
                />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupListScreen;

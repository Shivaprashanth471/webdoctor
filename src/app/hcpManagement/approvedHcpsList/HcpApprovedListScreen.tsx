import { TextField, Tooltip } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { SearchRounded } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../classes/ts-data-list-wrapper.class";
import LoaderComponent from "../../../components/LoaderComponent";
import NoDataCardComponent from "../../../components/NoDataCardComponent";
import { useLocalStorage } from "../../../components/useLocalStorage";
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import { StateParams } from "../../../store/reducers";
import HcpFiltersComponent from "../filters/HcpFiltersComponent";
import "./HcpApprovedListScreen.scss";

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#10c4d3",
      },
    },
  },
})(TextField);

const HcpApprovedListScreen = () => {
  const [list, setList] = useState<TsDataListState | null>(null);
  const { role } = useSelector((state: StateParams) => state?.auth?.user);
  const [hcpTypes, setHcpTypes] = useState<any | null>(null);

  const [selectedHcpTypes, setSelectedHcpTypes] = useLocalStorage<any>("hcpSelectedTypes", []);
  const [dateRange, setDateRange] = useLocalStorage<any[]>("hcpDateRange", [null, null]);
  const [status, setStatus] = useLocalStorage<any>("hcpStatus", "");
  const [pageSizeIndex, setPageSizeIndex] = useLocalStorage<any>("hcpApprovedPageSizeIndex", 10);

  const onReload = useCallback(
    (page = 1) => {
      if (list) {
        list.table.reload(page);
      } else {
        setList((prevState) => {
          prevState?.table.reload(page);
          return prevState;
        });
      }
    },
    [list]
  );

  const getHcpTypes = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "meta/hcp-types")
      .then((resp) => {
        setHcpTypes(resp.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const init = useCallback(() => {
    let url = "hcp/list";
    let payload: any = {};
    payload.is_approved = 1;

    if (selectedHcpTypes.length > 0) {
      payload.hcp_type = selectedHcpTypes.map((item: any) => item?.name);
    }

    if (status !== "") {
      payload.is_active = status?.code;
    }

    if (dateRange[0] || dateRange[1]) {
      let startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      let endDate = moment(dateRange[1]).format("YYYY-MM-DD");

      if (!dateRange[1]) {
        payload.start_date = startDate;
        payload.end_date = startDate;
      } else {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }
    }

    const options = new TsDataListOptions(
      {
        // @ts-ignore
        pagination: {
          ...list?.table?.pagination,
          pageSize: pageSizeIndex,
        },
        extraPayload: payload,
        webMatColumns: role === "super_admin" ? ["Created On", "Name", "Contact Number", "Email", "HCP Type", "Active/Inactive", "Actions"] : ["Created On", "Name", "Contact Number", "Email", "HCP Type", "Status", "Actions"],
        mobileMatColumns: role === "super_admin" ? ["Created On", "Name", "Contact Number", "Email", "HCP Type", "Active/Inactive", "Actions"] : ["Created On", "Name", "Contact Number", "Email", "HCP Type", "Status", "Actions"],
      },
      ENV.API_URL + url,
      setList,
      ApiService,
      "post"
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
    let payload: any = {};
    payload.is_approved = 1;

    if (selectedHcpTypes.length > 0) {
      payload.hcp_type = selectedHcpTypes.map((item: any) => item?.name);
    }

    if (status !== "") {
      payload.is_active = status?.code;
    }

    if (dateRange[0] || dateRange[1]) {
      let startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      let endDate = moment(dateRange[1]).format("YYYY-MM-DD");

      if (!dateRange[1]) {
        payload.start_date = startDate;
        payload.end_date = startDate;
      } else {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }
    }

    list?.table?.setExtraPayload(payload);
    list?.table?.getList(1);
    // eslint-disable-next-line
  }, [selectedHcpTypes, dateRange, status]);

  const clearFilterValues = () => {
    setDateRange([null, null]);
    setStatus("");
    setSelectedHcpTypes([]);
  };

  const resetFilters = () => {
    clearFilterValues();
  };

  const handletoggleStatus = useCallback((id: any, is_active) => {
      let payload = {
        is_active: !is_active,
      };
      CommonService._api.put(ENV.API_URL + "hcp/" + id, payload).then((resp) => {
          onReload(Number(list?.table?.pagination?.pageIndex) + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [onReload, list?.table?.pagination?.pageIndex]
  );

  useEffect(() => {
    getHcpTypes();
    Communications.pageTitleSubject.next("HCP Approved");
    Communications.pageBackButtonSubject.next(null);
  }, [getHcpTypes]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <>
      <div className={"hcp-list screen crud-layout pdd-30"}>
        {list && list.table?._isDataLoading && (
          <div className="table-loading-indicator">
            <LoaderComponent />
          </div>
        )}

        <HcpFiltersComponent
          selectedHcpTypes={selectedHcpTypes}
          setSelectedHcpTypes={setSelectedHcpTypes}
          resetFilters={resetFilters}
          isApprovedList={true}
          hcpTypes={hcpTypes}
          status={status}
          setStatus={setStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="custom-border pdd-10  pdd-top-20 pdd-bottom-0">
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
                          id="clear_hcp_search"
                        />
                      </div>
                    )}
                    <div>
                      <CssTextField
                        defaultValue={""}
                        className="search-cursor searchField"
                        id="input_search_hcp"
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
                        placeholder={"Search HCP"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {list && list.table && (
            <>
              <TableContainer component={Paper} className={"table-responsive"}>
                <Table stickyHeader className="mat-table table hcp-list-table">
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
                          <TableCell className="mat-td mat-td-created-at">{moment(row["created_at"]).format("MM-DD-YYYY")}</TableCell>
                          <TableCell className="mat-td mat-td-hcp-name">
                            {row["first_name"]}&nbsp;{row["last_name"]}
                          </TableCell>
                          <TableCell className="mat-td mat-td-contact-number">{row["contact_number"]}</TableCell>
                          <TableCell className="mat-td mat-td-email">{row["email"]}</TableCell>
                          <TableCell className="mat-td mat-td-hcp-type">{row["hcp_type"]}</TableCell>
                          {role === "super_admin" ? (
                            <TableCell style={{ textAlign: "center" }} className="mat-td mat-td-status">
                              <Tooltip title={"ACTIVE / INACTIVE"}>
                                <FormControlLabel control={<Switch checked={row["is_active"]} onChange={() => handletoggleStatus(row["_id"], row["is_active"])} />} label={""} />
                              </Tooltip>
                            </TableCell>
                          ) : row["is_active"] ? (
                            <TableCell style={{ color: "#41D6C3" }} className="mat-td mat-td-status">Active</TableCell>
                          ) : (
                            <TableCell style={{ color: "#808080" }} className="mat-td mat-td-status"> Inactive</TableCell>
                          )}
                          <TableCell className="mat-td mat-td-sticky mat-td-actions">
                            <Tooltip title={`${row["first_name"]} ${row["last_name"]} view details`}>
                              <Link to={"/hcp/user/view/" + row["user_id"]} className="info-link" id={"link_hospital_details" + rowIndex}>
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

export default HcpApprovedListScreen;

import React, { useCallback, useEffect, useState } from "react";
import { ENV } from "../../../../constants";
import { CommonService, Communications } from "../../../../helpers";
import "./ClosedShiftsViewScreen.scss";
import { useParams } from "react-router-dom";
import { Avatar, Checkbox, Tooltip } from "@material-ui/core";
import moment from "moment";
import { Button } from "@material-ui/core";
import ShiftTimeline from "../../timeline/ShiftTimeline";
import { Link } from "react-router-dom";
import DialogComponent from "../../../../components/DialogComponent";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CustomPreviewFile from "../../../../components/shared/CustomPreviewFile";
import LoaderComponent from "../../../../components/LoaderComponent";

const ClosedShiftsViewScreen = () => {
  const param = useParams<any>();
  const { id } = param;
  const [basicDetails, setBasicDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentsList, seAttachmentsList] = useState<any | null>(null);
  const [downloadAttachmentsList, downloadSeAttachmentsList] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [isFacilityConfirm, setIsFacilityConfirm] = useState<boolean>(false);


  const previewFile = useCallback(
    (index: any) => {
      setPreviewFile(attachmentsList[index]);
      setOpen(true);
    },
    [attachmentsList]
  );

  const cancelPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);
  const confirmPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);

  const getShiftAttachments = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "shift/" + id + "/attachments?is_preview=true")
      .then((resp) => {
        seAttachmentsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getShiftAttachmentsDownload = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "shift/" + id + "/attachments")
      .then((resp) => {
        downloadSeAttachmentsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getShiftDetails = useCallback(() => {
    setIsLoading(true);
    CommonService._api
      .get(ENV.API_URL + "shift/" + id)
      .then((resp) => {
        setBasicDetails(resp.data);
        setIsFacilityConfirm(resp.data?.is_facility_approved)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    getShiftDetails();
    getShiftAttachments();
    getShiftAttachmentsDownload();
  }, [getShiftDetails, getShiftAttachments, getShiftAttachmentsDownload]);
  useEffect(() => {
    Communications.pageTitleSubject.next("Shifts Closed");
    Communications.pageBackButtonSubject.next("/closedShifts/list");
  }, []);

  const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.expected?.shift_start_time, basicDetails?.expected?.shift_end_time);
  const shift_date = CommonService.getUtcDate(basicDetails?.shift_date);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="shift-closed-view screen crud-layout pdd-30">
      <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
        <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
      </DialogComponent>

      {!isLoading && (
        <>
          <div className="pdd-0 custom-border">
            <div className="d-flex pdd-20 hcp-photo-details-wrapper">
              <div className="d-flex">
                <div className="flex-1">
                  <Avatar style={{ height: "80px", width: "80px" }}>{basicDetails?.hcp_user?.first_name?.toUpperCase().charAt("0")}</Avatar>
                </div>
                <div className="hcp-name-type">
                  <h2>
                    {basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}
                  </h2>
                  <p>{basicDetails?.hcp_user?.hcp_type}</p>
                </div>
              </div>
            </div>
            <div className="d-flex hcp-details pdd-bottom-20 custom-border " style={{ gap: "20px" }}>
              <div className="flex-1">
                <h4>Years Of Experience</h4>
                <p>{basicDetails?.hcp_user?.experience ? basicDetails?.hcp_user?.experience + " Years" : "N/A"}</p>
              </div>
              <div className="flex-1">
                <h4>Contact Number</h4>
                <p>{basicDetails?.hcp_user?.contact_number}</p>
              </div>
              <div className="flex-1">
                <h4>Address</h4>
                <p>
                  {basicDetails?.hcp_user?.address?.region},&nbsp;{basicDetails?.hcp_user?.address?.city},&nbsp;{basicDetails?.hcp_user?.address?.state},&nbsp;{basicDetails?.hcp_user?.address?.country},&nbsp;
                  {basicDetails?.hcp_user?.address?.zip_code}&nbsp;&nbsp;
                </p>
              </div>
              <div className="flex-1">
                <h4>Email</h4>
                <p>{basicDetails?.hcp_user?.email}</p>
              </div>
              <div className="flex-1">
                <h4>HCP Rate (hr)</h4>
                <p>{basicDetails?.hcp_user?.rate} $</p>
              </div>
            </div>
          </div>
          <div className="facility-details d-flex custom-border mrg-top-10 pdd-bottom-5">
            <div className="flex-1">
              <h2>{basicDetails?.facility?.facility_name}</h2>
              <p>
                {basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;
                {basicDetails?.facility?.address?.zip_code}.
              </p>
            </div>
            <div className="flex-1 actions-wrapper">
              <div className="button">
                <Tooltip title={`View ${basicDetails?.facility?.facility_name} Details`}>
                  <Button component={Link} color={"primary"} variant={"outlined"} to={{ pathname: "/facility/view/" + basicDetails?.facility?._id, state: { prevPath: "/closedShifts/view/" + id } }}>
                    View Details
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="facility-details mrg-top-10 custom-border">
            <div className="d-flex shift-name-requested">
              <h2>Shift Details</h2>
              <div className="d-flex requested-on-wrapper">
                <h3>Created On:</h3>
                <p className="mrg-left-10">{moment(basicDetails?.created_at).format("MM-DD-YYYY")}</p>
              </div>
            </div>
            <p>{basicDetails?.title}</p>
            <div className="d-flex shift-details">
              <div className="flex-1">
                <h3>Required On:</h3>
                <p>{shift_date}</p>
              </div>
              <div className="flex-1">
                <h3>Time</h3>
                <p>
                  {start_time} &nbsp;-&nbsp;{end_time}
                </p>
              </div>
              <div className="flex-1">
                <h3>Time Type:</h3>
                <p>{basicDetails?.shift_type}</p>
              </div>
              <div className="flex-1">
                <h3>Warning Zone</h3>
                <p>{basicDetails?.warning_type}</p>
              </div>
            </div>
            <div className="d-flex shift-details">
              <div className="flex-1">
                <h3>HCP Differential Rate</h3>
                <p>{basicDetails?.payments?.differential}</p>
              </div>
              <div className="flex-1">
                <h3>HCP OT Hourly Rate</h3>
                <p>{basicDetails?.facility?.conditional_rates?.overtime?.rate}</p>
              </div>
              <div className="flex-1"></div>
              <div className="flex-1"></div>
            </div>
          </div>
          <div className="mrg-top-10 custom-border pdd-top-10">
            <div className="d-flex shift-name-requested">
              <h2>Shift Details</h2>
              <div className="d-flex requested-on-wrapper">
                <h3 className="hcp-rate">
                  HCP Rate:<span className="mrg-left-10 ">{basicDetails?.hcp_user?.rate} $</span>
                </h3>
              </div>
            </div>
            <div className="d-flex shift-date-time">
              <div className="d-flex flex-1 flex-baseline">
                <h3>Attended On:</h3>
                <p className="attended-date mrg-left-15">{basicDetails?.actuals?.shift_start_time ? moment(basicDetails?.actuals?.shift_start_time).format("MM-DD-YYYY") : moment(basicDetails?.expected?.shift_start_time).format("MM-DD-YYYY")}</p>
              </div>
              <div className=" d-flex  flex-center">
                <h3 className="attended-date mrg-left-15">Facility Confirmation</h3>
                <Checkbox checked={isFacilityConfirm} disabled />
              </div>
            </div>
            <ShiftTimeline timeBreakup={basicDetails?.time_breakup} />
            <div className="mrg-top-70">
              {attachmentsList?.length > 0 && (
                <>
                  <h3>Attachment:</h3>
                  <div className="d-flex" style={{ gap: "50px" }}>
                    {attachmentsList?.map((item: any, index: any) => {
                      return (
                        <div className="attachments">
                          <p className="mrg-left-10">{item?.attachment_type}</p>
                          <div>
                            <Tooltip title="Preview CDPH 530 A Form">
                              <InsertDriveFileIcon color={"primary"} className="file-icon" onClick={() => previewFile(index)} />
                            </Tooltip>
                            <div className="d-flex">
                              <Tooltip title="Preview CDPH 530 A Form">
                                <p onClick={() => previewFile(index)} className="file-actions">
                                  Preview
                                </p>
                              </Tooltip>
                              <Tooltip title="Download CDPH 530 A Form">
                                <a href={downloadAttachmentsList[index]?.url} download className="file-actions  mrg-left-20">
                                  Download
                                </a>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClosedShiftsViewScreen;

import moment from "moment";
import React, { PropsWithChildren } from "react";
import NoDataToShowCardComponent from "../../../../components/NoDataToShowCardComponent";
import { CommonService } from "../../../../helpers";

export interface HcpEducationComponentProps {
  educationDetails: any;
}

const HcpEducationComponent = (props: PropsWithChildren<HcpEducationComponentProps>) => {
  const educationDetails = props?.educationDetails;
  const sortedEducationData = educationDetails && CommonService.sortDatesByLatest(educationDetails, "start_date");

  return (
    <div>
      {educationDetails?.length > 0 ? (
        sortedEducationData?.map((item: any, index: any) => {
          return (
            <div className={index !== 0 ? "mrg-top-30" : ""}>
              <h4 className="title-count ">Education {index + 1}</h4>
              <div className="d-flex">
                <div className="flex-1">
                  <h4>Institute</h4>
                  <p>{item.institute_name}</p>
                </div>
                <div className="flex-1">
                  <h4>Location</h4>
                  <p>{item.location}</p>
                </div>
                <div className="flex-1">
                  <h4>Degree</h4>
                  <p>{item.degree}</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="flex-1">
                  <h4>Start and End Date</h4>
                  <p>
                    {item?.start_date ? moment(item?.start_date).format("MMMM, YYYY") : "N/A"}&nbsp;-&nbsp;{item?.graduation_date ? moment(item?.graduation_date).format("MMMM, YYYY") : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataToShowCardComponent />
      )}
    </div>
  );
};

export default HcpEducationComponent;

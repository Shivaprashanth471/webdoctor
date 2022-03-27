import { Button, Table, TableBody, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import moment from "moment";
import React, { useCallback, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { ApiService, CommonService } from "../../../../helpers";
import { educationValidation } from "../../add/EducationAddComponent/EducationValidation";
import "./EducationEditComponent.scss";
import ReadOnlyRow from "./ReadOnlyRow";

type EducationAddComponentProps = {
  hcpId: string;
  education: any;
  setEducation: any;
  getEducationDetails: any;
  onAddEducation: any;
};

interface EducationItem {
  institute_name: string;
  degree: string;
  location: string;
  start_date: any;
  graduation_date: any;
}

const educationInitialState: EducationItem = {
  institute_name: "",
  degree: "",
  location: "",
  start_date: null,
  graduation_date: null,
};

const EducationAddComponent = ({ onAddEducation, getEducationDetails, education, setEducation, hcpId }: EducationAddComponentProps) => {
  const [isEducation, setIsEducation] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [educationId, setEducationId] = useState<any>(null);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const onAdd = (education: EducationItem, { setSubmitting, setErrors, resetForm }: FormikHelpers<EducationItem>) => {
    const newEducation = {
      institute_name: education.institute_name,
      degree: education.degree,
      location: education.location,
      start_date: education.start_date ?  moment(education.start_date).format("YYYY-MM") : null,
      graduation_date: education.graduation_date ? moment(education.graduation_date).format("YYYY-MM") : null,
    };

    //add new education
    onAddEducation(newEducation)
      .then((resp: any) => {
        getEducationDetails();
        setIsEducation(false);
        resetForm();
        CommonService.showToast(resp?.msg || "HCP education added", "info");
      })
      .catch((err: any) => console.log(err));
  };

  const handleDeleteClick = useCallback(
    (educationId: number) => {
      setIsConfirm(true);
      ApiService.delete(ENV.API_URL + "hcp/" + hcpId + "/education/" + educationId)
        .then((resp: any) => {
          getEducationDetails();
          CommonService.showToast(resp?.msg || "hcp education deleted", "success");
          setIsConfirm(false);
          setIsAddOpen(false);
        })
        .catch((err) => {
          console.log(err);
          setIsConfirm(false);
        });
    },
    [getEducationDetails, hcpId]
  );

  const openAdd = useCallback((id: any) => {
    setEducationId(id);
    setIsAddOpen(true);
  }, []);

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const confirmAdd = useCallback(() => {
    handleDeleteClick(educationId);
  }, [educationId, handleDeleteClick]);

  const sortedEducationData = CommonService.sortDatesByLatest(education, "start_date");

  return (
    <div className="add-container">
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent isConfirm={isConfirm} cancel={cancelAdd} confirm={confirmAdd} text1="Want to delete" hcpname={"Education"} groupname={""} confirmationText={""} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>
      {education.length > 0 && (
        <Table className="mrg-top-50 border">
          <TableHead className={"mat-thead"}>
             <TableRow className={"mat-tr"}>
              <th>Institution Name</th>
              <th>Degree</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
            </TableRow>
          </TableHead>
         <TableBody className={"mat-tbody"}>
            {sortedEducationData.map((education: any, index: number) => (
              <>
                <ReadOnlyRow index={index} key={index} education={education} openAdd={openAdd} />
              </>
            ))}
          </TableBody>
        </Table>
      )}

      {isEducation ? (
        <Formik initialValues={educationInitialState} validateOnChange={true} validationSchema={educationValidation} onSubmit={onAdd}>
          {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
            <Form className={"form-holder"}>
              <div className="input-container">
                <Field variant="outlined" fullWidth component={TextField} name="institute_name" label="Institution Name*" id="input_hcp_edit_education_institution_name" />

                <Field variant="outlined" fullWidth component={TextField} name="location" label="Location*" id="input_hcp_edit_education_start_date" />
              </div>

              <div className="input-container">
                <Field variant="outlined" fullWidth component={TextField} name="degree" label="Degree*" id="input_hcp_edit_education_location" />
                <Field
                  fullWidth
                  variant="inline"
                  openTo="year"
                  views={["year", "month"]}
                  inputVariant="outlined"
                  component={DatePicker}
                  placeholder="MM/YYYY"
                  name="start_date"
                  id="input_hcp_edit_education_start_date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="input-container minor">
                <Field
                  fullWidth
                  variant="inline"
                  openTo="year"
                  views={["year", "month"]}
                  inputVariant="outlined"
                  component={DatePicker}
                  placeholder="MM/YYYY"
                  id="input_hcp_edit_education_end_date"
                  name="graduation_date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="hcp-common-btn-grp">
                <Button
                  variant="outlined"
                  type="reset"
                  id="btn_hcp_edit_education_close"
                  onClick={() => {
                    resetForm();
                    setIsEducation(false);
                  }}
                >
                  Delete
                </Button>

                <Button color="primary" variant="contained" type="submit" id="btn_hcp_edit_education_submit" className={isSubmitting ? "has-loading-spinner" : ""} disabled={isSubmitting}>
                  {isSubmitting ? "Saving" : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="edu-add-action">
          <Tooltip title={"Add New Education"}>
            <p id="btn_hcp_add_education" onClick={() => setIsEducation(true)} className="generic-add-multiple">
              + Add Education
            </p>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default EducationAddComponent;

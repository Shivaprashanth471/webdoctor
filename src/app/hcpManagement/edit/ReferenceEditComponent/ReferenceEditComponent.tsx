import { Button, Table, TableBody, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { ApiService, CommonService } from "../../../../helpers";
import { referenceValidation } from "../../add/ReferenceAddComponent/ReferenceValidation";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ReferenceEditComponent.scss";

type ReferenceAddComponentProps = {
  onAddReference: any;
  hcpId: string;
  getReferenceDetails: any;
  reference: any;
  setReference: any;
};

interface ReferenceItem {
  name: string;
  jobTitle: string;
  contactNumber: string;
  email: string;
}

const referenceInitialState: ReferenceItem = {
  name: "",
  jobTitle: "",
  contactNumber: "",
  email: "",
};

const ReferenceAddComponent = ({ onAddReference, hcpId, getReferenceDetails, reference, setReference }: ReferenceAddComponentProps) => {
  const [isReference, setIsReference] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<any>(null);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const onAdd = (reference: ReferenceItem, { setSubmitting, setErrors, resetForm }: FormikHelpers<ReferenceItem>) => {
    const newReference = {
      reference_name: reference.name,
      job_title: reference.jobTitle,
      contact_method: "phone",
      phone: reference.contactNumber,
      email: reference.email,
    };

    onAddReference(newReference)
      .then((resp: any) => {
        getReferenceDetails();
        CommonService.showToast(resp?.msg || "HCP reference added", "info");
        resetForm();
        handleCancelAdd();
      })
      .catch((err: any) => console.log(err));
  };

  const handleCancelAdd = () => {
    setIsReference(false);
  };

  const handleDeleteClick = useCallback(
    (referenceId: number) => {
      setIsConfirm(true);
      ApiService.delete(ENV.API_URL + "hcp/" + hcpId + "/reference/" + referenceId)
        .then((resp: any) => {
          getReferenceDetails();

          CommonService.showToast(resp?.msg || "hcp reference deleted", "success");
          setIsConfirm(false);
          setIsAddOpen(false);
        })
        .catch((err) => {
          console.log(err);
          setIsConfirm(false);
        });
    },
    [getReferenceDetails, hcpId]
  );

  const openAdd = useCallback((id: any) => {
    setReferenceId(id);
    setIsAddOpen(true);
  }, []);

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const confirmAdd = useCallback(() => {
    handleDeleteClick(referenceId);
  }, [referenceId, handleDeleteClick]);

  return (
    <div className="add-container">
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent isConfirm={isConfirm} cancel={cancelAdd} confirm={confirmAdd} text1="Want to delete" hcpname={"Reference"} groupname={""} confirmationText={""} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>

      {reference.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead className={"mat-thead"}>
             <TableRow className={"mat-tr"}>
              <th>Reference Name</th>
              <th>Reference Job Title</th>
              <th>Contact Number</th>
              <th>Email</th>
            </TableRow>
          </TableHead>
         <TableBody className={"mat-tbody"}>
            {reference.map((reference: any, index: any) => (
              <ReadOnlyRow key={index} reference={reference} openAdd={openAdd} />
            ))}
          </TableBody>
        </Table>
      )}

      {isReference ? (
        <div className="reference-add-input">
          <Formik initialValues={referenceInitialState} validateOnChange={true} validationSchema={referenceValidation} onSubmit={onAdd}>
            {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className="form-holder">
                <div className="input-container">
                  <Field variant="outlined" component={TextField} fullWidth type="text" name="name" label="Reference Name" id="input_hcp_edit_reference_name" />

                  <Field variant="outlined" component={TextField} fullWidth type="text" name="jobTitle" label="Reference Job Title" id="input_hcp_edit_reference_job" />
                </div>

                <div className="input-container">
                  <Field type="number" variant="outlined" component={TextField} fullWidth name="contactNumber" label="Contact Number" id="input_hcp_edit_reference_number" />

                  <Field variant="outlined" component={TextField} fullWidth type="email" name="email" label="Email (optional)" id="input_hcp_edit_reference_email" />
                </div>

                <div className="hcp-common-btn-grp">
                  <Button
                    variant="outlined"
                    type="reset"
                    onClick={() => {
                      resetForm();
                      handleCancelAdd();
                    }}
                    id="btn_hcp_edit_reference_cancel"
                  >
                    Delete
                  </Button>
                  <Button color="primary" variant="contained" type="submit" id="btn_hcp_edit_reference_submit" className={isSubmitting ? "has-loading-spinner" : ""} disabled={isSubmitting}>
                    {isSubmitting ? "Saving" : "Save"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="ref-add-action">
          <Tooltip title={"Add New Reference"}>
            <p id="btn_hcp_add_reference" onClick={() => setIsReference(true)} className="generic-add-multiple">
              + Add Reference
            </p>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ReferenceAddComponent;

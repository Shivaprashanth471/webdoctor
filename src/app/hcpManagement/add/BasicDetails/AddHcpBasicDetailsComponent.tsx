import { Box, FormControlLabel, MenuItem, Radio, Tooltip } from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { Field, FieldProps, Form, Formik } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import React, { useCallback, useEffect, useState } from "react";
import FileDropZoneComponent from "../../../../components/core/FileDropZoneComponent";
import PhoneInputComponent from "../../../../components/phoneInput/PhoneInputComponent";
import { ScrollToError } from "../../../../components/ScrollToError";
import { boolAcknowledge, contactType, covidPreference, genderTypes, gustoType, moreImportant, salaryCredit, shiftTypePreference, travelDistancePreference, vaccine } from "../../../../constants/data";
import HcpAddAttachmentsComponent from "../AddAtachments/HcpAddAttachmentsComponent";
import { AddHcpInitialValues, hcpFormValidation, HcpItemAddType } from "../AddHcpValuesValidationsComponent";

const AddHcpBasicDetailsComponent = (props: any) => {
  const [vaccineStatus, setVaccineStatus] = useState<string>("");
  const [isFirstShotVisible, setIsFirstShotVisible] = useState<boolean>(false);
  const [isLastShotVisible, setIsLastShotVisible] = useState<boolean>(false);

  const contractFile = props?.contractFile;
  const fileUpload = props?.fileUpload;
  const setPreviewFile = props?.setPreviewFile;
  const setOpen = props?.setOpen;
  const onAdd = props?.onAdd;
  const hcpTypes = props?.hcpTypes;
  const regions = props?.regions;
  const specialities = props?.specialities;
  const expInYears = props?.expInYears;
  const required_attachments = props?.required_attachments;
  const setRequiredAttachments = props?.setRequiredAttachments;
  const OnContractFileUpload = props?.OnContractFileUpload;
  const deleteContractFile = props?.deleteContractFile;
  const setFileUpload = props?.setFileUpload;

  let hcpInitialState: HcpItemAddType = AddHcpInitialValues;

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      getContentAnchorEl: null,
    },
  };
  const previewFile = useCallback(
    (index: any, type: any) => {
      if (type === "contract") {
        setPreviewFile(contractFile?.wrapper[0]);
      } else {
        setPreviewFile(fileUpload?.wrapper[index]);
      }
      setOpen(true);
    },
    [fileUpload, contractFile?.wrapper, setPreviewFile, setOpen]
  );

  useEffect(() => {
    if (vaccineStatus === "full") {
      setIsFirstShotVisible(true);
      setIsLastShotVisible(true);
    }
    if (vaccineStatus === "half") {
      setIsFirstShotVisible(true);
      setIsLastShotVisible(false);
    }
    if (vaccineStatus === "exempted") {
      setIsFirstShotVisible(false);
      setIsLastShotVisible(false);
    }
    if (vaccineStatus === "") {
      setIsFirstShotVisible(false);
      setIsLastShotVisible(false);
    }
  }, [vaccineStatus]);


  return (
    <div>
      <Formik initialValues={hcpInitialState} validateOnChange={true} validationSchema={hcpFormValidation} onSubmit={onAdd}>
        {({ isSubmitting, isValid, resetForm, errors, handleChange, values, setFieldValue }) => (
          <Form id="add-hcp-form" className={"form-holder"}>
            <div>
              <div className="custom-border">
                <p className="card-header">Basic Details</p>
                <div className="input-container">
                  <Field variant="outlined" name="first_name" type={"text"} component={TextField} id="input_hcp_add_first_name" label="First Name*" fullWidth autoComplete="off" />
                  <Field variant="outlined" name="last_name" id="input_hcp_add_last_name" type={"text"} component={TextField} label="Last Name*" fullWidth autoComplete="off" />
                </div>

                <div className="input-container">
                  <Field variant="outlined" component={TextField} type={"email"} fullWidth autoComplete="off" className="flex-1" label="Email*" name="email" id="input_hcp_add_email" />

                  <div className="flex-1">
                    <Field required name={"contact_number"} className="flex-1">
                      {(field: FieldProps) => {
                        return <PhoneInputComponent field={field} placeholder={"Enter Phone number*"} />;
                      }}
                    </Field>
                  </div>
                </div>
                <div className="input-container">
                  <div className="flex-1">
                    <Field
                      SelectProps={showDropDownBelowField}
                      variant="outlined"
                      onChange={(e: any) => {
                        const hcpType = e.target.value;
                        setFieldValue("hcp_type", hcpType);
                      }}
                      component={TextField}
                      type={"text"}
                      select
                      label="HCP Type*"
                      id="menu_hcp_add_hcp_type"
                      name="hcp_type"
                      fullWidth
                      autoComplete="off"
                    >
                      {hcpTypes.map((item: any, index: number) => (
                        <MenuItem value={item.code} key={"hcp_type_" + index} id={"menu_hcp_add_hcp_type" + item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Gender"}*</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="gender" id="radio_doctor_add_gender">
                        <div className="d-flex">
                          {genderTypes.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"gender_type_" + index} value={item.value} control={<Radio required disabled={isSubmitting} />} disabled={isSubmitting} onChange={(event) => handleChange(event)} label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>
                <div className="input-container">
                  <Field variant="outlined" name="address.street" type={"text"} component={TextField} label="Street*" id="input_hcp_add_street" fullWidth autoComplete="off" />
                  <Field variant="outlined" name="address.city" type={"text"} component={TextField} id="input_hcp_add_city" label="City*" fullWidth autoComplete="off" />
                </div>
                <div className="input-container">
                  <Field SelectProps={showDropDownBelowField} variant="outlined" component={TextField} type={"text"} select label="Region*" name="address.region" id="menu_hcp_add_region" fullWidth autoComplete="off">
                    {regions &&
                      regions.map((item: any, index: any) => (
                        <MenuItem value={item.code} key={"region_" + index} id={"menu_hcp_add_region" + item.code}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Field>
                  <Field variant="outlined" name="address.state" id="input_hcp_add_state" type={"text"} component={TextField} label="State*" fullWidth autoComplete="off" />
                </div>
                <div className="input-container">
                  <Field variant="outlined" fullWidth name="address.zip_code" type={"number"} component={TextField} id="input_hcp_add_zip" label="Zip*" autoComplete="off" />
                  <Field variant="outlined" name="address.country" type={"text"} component={TextField} id="input_hcp_add_country" label="Country*" fullWidth autoComplete="off" />
                </div>
                <div className="facility-about mrg-top-50">
                  <p className="card-header">About the HCP</p>
                  <Field placeholder="About the Hcp" variant="outlined" component={TextField} type={"text"} fullWidth autoComplete="off" name="about" id="input_hcp_add_about" multiline />
                </div>
              </div>
              <div className="custom-border">
                <div className="professional-summary mrg-top-10 ">
                  <p className="card-header">Professional Summary</p>
                  <Field variant="outlined" component={TextField} type={"text"} fullWidth autoComplete="off" name="professional_details.summary" id="input_hcp_add_summary" multiline placeholder="Enter Professional Summary" />
                </div>
              </div>
              <div className="hcp-profession-details  mrg-top-10 custom-border">
                <p className="card-header">Professional Details (Based on Work Experience)</p>
                <div className="input-container">
                  <Field value={expInYears} disabled variant="outlined" component={TextField} label="Years of Experience" name="professional_details.experience" id="input_hcp_add_proffesional_details" fullWidth autoComplete="off" />
                </div>
                <div className="input-container professional-details">
                  <Field value={specialities.join(",")} disabled variant="outlined" component={TextField} type={"text"} label="Specialities" id="input_hcp_add_speciality" name="professional_details.speciality" fullWidth autoComplete="off" />
                </div>
              </div>
              <div className="hcp-documents mrg-top-10 custom-border">
                <h3 className="card-header">Documents/Attachments</h3>
                <HcpAddAttachmentsComponent required_attachments={required_attachments} setRequiredAttachments={setRequiredAttachments} fileUpload={fileUpload} setFileUpload={setFileUpload} previewFile={previewFile} />
              </div>
              <div className="custom-border mrg-top-10">
                <div className="attachments_wrapper  mrg-bottom-30">
                  {contractFile?.wrapper?.map((item: any, index: any) => {
                    return (
                      <div className="attachments">
                        <h3 className="mrg-top-10 mrg-bottom-10 file_name card-header">{"Contract"}</h3>
                        <div className="custom_file">
                          <div className="d-flex">
                            <div className="mrg-top-15">
                              <InsertDriveFileIcon color={"primary"} className="file-icon" />
                            </div>
                          </div>
                          <div className="d-flex contract_actions mrg-top-5 mrg-left-5">
                            <Tooltip title={"View Contract"}>
                              <p style={{ cursor: "pointer" }} onClick={() => previewFile(index, "contract")} className="delete-image">
                                View
                              </p>
                            </Tooltip>
                            <Tooltip title={"Delete Contract"}>
                              <p style={{ cursor: "pointer", width: "50px" }} className="mrg-left-20" onClick={() => deleteContractFile(index)}>
                                Delete
                              </p>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {contractFile?.wrapper.length >= 1 ? (
                  <></>
                ) : (
                  <div>
                    <h3 className="card-header">Contract</h3>
                    <Box display="flex" gridGap="10px">
                    <Tooltip title={"Upload Contract"}>
                      <Box width="250px" className="mrg-top-10">
                        <FileDropZoneComponent allowedTypes={".pdf"} OnFileSelected={OnContractFileUpload} />
                      </Box>
                      </Tooltip>
                    </Box>
                  </div>
                )}
                <div className="input-container mrg-top-30">
                  <Field placeholder="Rate/hr" variant="outlined" component={TextField} type={"text"} fullWidth autoComplete="off" InputLabelProps={{ shrink: true }} label="Rate/hr" name="contract_details.rate_per_hour" />
                  <Field
                    variant="inline"
                    orientation="landscape"
                    openTo="date"
                    format="MM/dd/yyyy"
                    views={["year", "month", "date"]}
                    inputVariant="outlined"
                    component={DatePicker}
                    placeholder="MM/DD/YYYY"
                    fullWidth
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    label="Signed On"
                    name="contract_details.signed_on"
                  />
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant="outlined"
                    name="contract_details.salary_credit"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_salary_credit"
                    label="Salary Credit Date"
                    fullWidth
                    autoComplete="off"
                  >
                    <MenuItem value="">Select Value</MenuItem>
                    {salaryCredit.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_salary_credit_" + index}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Field>
                </div>
              </div>

              <div className="travel-preferences custom-border mrg-top-10">
                <p className="card-header">Travel Preferences</p>
                <div className="travel-preferences-container">
                  {travelDistancePreference.map((item) => (
                    <Field type="checkbox" component={CheckboxWithLabel} name="nc_details.travel_preferences" key={item.value} value={item.value} Label={{ label: item.label }} />
                  ))}
                </div>
              </div>

              <div className="nc-section custom-border mrg-top-10">
                <p className="card-header">NC Section</p>
                <div className="input-container">
                  <Field variant="outlined" name="nc_details.dnr" type={"text"} component={TextField} label="DNR" id="input_hcp_add_dnr" fullWidth autoComplete="off" />
                  <Field SelectProps={showDropDownBelowField} select variant="outlined" name="nc_details.contact_type" type={"text"} component={TextField} id="input_hcp_add_contact_type" label="Contact Type" fullWidth autoComplete="off">
                    <MenuItem value="">Select Value</MenuItem>
                    {contactType.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_contact_type" + index}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field variant="outlined" name="nc_details.location_preference" type={"text"} component={TextField} label="Preferred Location to Work" id="input_hcp_add_location_preference" fullWidth autoComplete="off" />

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant="outlined"
                    name="nc_details.shift_type_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_shift_type_preference"
                    label="Preference Shift Type"
                    fullWidth
                    autoComplete="off"
                  >
                    <MenuItem value="">Select Value</MenuItem>
                    {shiftTypePreference.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_shift_type_preference" + index}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field variant="outlined" name="nc_details.zone_assignment" type={"text"} component={TextField} id="input_hcp_add_zone_assignment" label="Zone Assignment" fullWidth autoComplete="off" />
                  <Field
                    variant='outlined'
                    component={TextField}
                    placeholder="MM-DD-YYYY"
                    fullWidth
                    autoComplete="off"
                    label="Last Call Date"
                    name="nc_details.last_call_date"
                  />
                </div>

                <div className="input-container">
                  <Field
                    onClick={(e: any) => {
                      setFieldValue("nc_details.vaccine", e.target.value);
                      setVaccineStatus(e.target.value);
                      if (e.target.value === "exempted") {
                        setFieldValue("nc_details.vaccination_dates.first_shot", "");
                        setFieldValue("nc_details.vaccination_dates.latest_shot", "");
                      }

                      if (e.target.value === "half") {
                        setFieldValue("nc_details.vaccination_dates.first_shot", "");
                      }

                      if (e.target.value === '') {
                        setFieldValue("nc_details.vaccination_dates.first_shot", "");
                        setFieldValue("nc_details.vaccination_dates.latest_shot", "");
                      }
                    }}
                    SelectProps={showDropDownBelowField}
                    select
                    variant="outlined"
                    name="nc_details.vaccine"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_vaccine"
                    label="Vaccine"
                    fullWidth
                    autoComplete="off"
                  >
                    <MenuItem value="">Select Value</MenuItem>
                    {vaccine.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_vaccine_" + index}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field variant="outlined" name="nc_details.family_consideration" type={"text"} component={TextField} id="input_hcp_add_family_consideration" label="Family Considerations" fullWidth autoComplete="off" />
                </div>

                <div className={`${isFirstShotVisible && isLastShotVisible ? "input-container" : "input-container-minor"}`}>
                  {isFirstShotVisible && (
                    <Field variant="outlined" name="nc_details.vaccination_dates.first_shot" type={"text"} component={TextField} label="First Shot Date (MM-DD-YYYY)" id="input_hcp_add_vaccination_dates_first_shot" fullWidth autoComplete="off" />
                  )}
                  {isLastShotVisible && (
                    <Field variant="outlined" name="nc_details.vaccination_dates.latest_shot" type={"text"} component={TextField} label="Latest Shot Date (MM-DD-YYYY" id="input_hcp_add_vaccination_dates_latest_shot" fullWidth autoComplete="off" />
                  )}
                </div>

                <div className="input-container d-flex">
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Do you have a Full-time Job?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_fulltime_job">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"full-time" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.is_fulltime_job" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Covid (or) Non Covid Facility?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.covid_facility_preference">
                        <div className="d-flex">
                          {covidPreference.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"full-time" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.covid_facility_preference" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>
                <div className="input-container d-flex">
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"What is more important for you?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.more_important_preference">
                        <div className="d-flex">
                          {moreImportant.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel
                                  key={"input_hcp_add_more_important_preference" + index}
                                  value={item.value}
                                  control={<Radio disabled={isSubmitting} />}
                                  disabled={isSubmitting}
                                  name="nc_details.more_important_preference"
                                  label={item.label}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Is this a Supplement to your Income ?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_supplement_to_income">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel
                                  key={"input_hcp_add_more_important_preference" + index}
                                  value={item.value}
                                  control={<Radio disabled={isSubmitting} />}
                                  disabled={isSubmitting}
                                  name="nc_details.is_supplement_to_income"
                                  label={item.label}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="input-container d-flex">
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Are you Studying?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_studying">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"input_hcp_add_more_important_preference" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.is_studying" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Gusto"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.gusto_type">
                        <div className="d-flex">
                          {gustoType.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"input_hcp_add_more_important_preference" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.gusto_type" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="input-container d-flex">
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Is Gusto Invited ?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_gusto_invited">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"input_hcp_add_more_important_preference" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.is_gusto_invited" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>{"Is Gusto Onboarded ?"}</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_gusto_onboarded">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"input_hcp_add_gusto_onboarded" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.is_gusto_onboarded" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="input-container d-flex">
                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>Require Sponsorship for Employment in United States?</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_require_employment_sponsorship">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel
                                  key={"input_hcp_add_is_require_employment_sponsorship" + index}
                                  value={item.value}
                                  control={<Radio disabled={isSubmitting} />}
                                  disabled={isSubmitting}
                                  name="nc_details.is_require_employment_sponsorship"
                                  label={item.label}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="pdd-top-10">
                      <FormLabel className={"form-label"}>Legally Authorized to work in United States?</FormLabel>
                    </div>
                    <div className="mrg-top-10">
                      <Field component={RadioGroup} name="nc_details.is_authorized_to_work">
                        <div className="d-flex">
                          {boolAcknowledge.map((item: any, index) => {
                            return (
                              <div>
                                <FormControlLabel key={"input_hcp_add_is_authorized_to_work" + index} value={item.value} control={<Radio disabled={isSubmitting} />} disabled={isSubmitting} name="nc_details.is_authorized_to_work" label={item.label} />
                              </div>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="input-container">
                  <Field multiline rows={2} variant="outlined" name="nc_details.other_information" type={"text"} component={TextField} id="input_hcp_add_other_information" label="Other Information Gathered" fullWidth autoComplete="off" />
                </div>
              </div>
            </div>
            <ScrollToError />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddHcpBasicDetailsComponent;

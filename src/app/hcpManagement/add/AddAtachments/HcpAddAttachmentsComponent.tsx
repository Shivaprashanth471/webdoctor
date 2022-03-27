import React from 'react';
import NormalTextField from '@material-ui/core/TextField';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { TsFileUploadConfig, TsFileUploadWrapperClass } from '../../../../classes/ts-file-upload-wrapper.class';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';
import { Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

const HcpAddAttachmentsComponent = (props: any) => {
  const fileUpload = props?.fileUpload;
  const setFileUpload = props?.setFileUpload;
  const previewFile = props?.previewFile;
  const required_attachments = props?.required_attachments;
  const setRequiredAttachments = props?.setRequiredAttachments;

  const OnFileSelected = (files: File[], index: any) => {
    if (required_attachments[index]) {
      required_attachments[index].index = fileUpload?.wrapper?.length || 0
      setRequiredAttachments([...required_attachments])
    }
    for (let file of files) {
      // console.log(file)
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: 'Data',
        uploadUrl: ENV.API_URL + 'facility/add',
        allowed_types: ['jpg', 'png', 'csv', 'pdf'],
        extraPayload: { expiry_date: '', file_type: required_attachments[index]?.name }
      };
      const uploadWrapper = new TsFileUploadWrapperClass(uploadConfig, CommonService._api, (state: { wrapper: TsFileUploadWrapperClass }) => {
        // console.log(state);
        setFileUpload((prevState: any) => {
          if (prevState) {
            const index = prevState?.wrapper.findIndex((value: any) => value.uploadId === state.wrapper.uploadId);
            prevState.wrapper[index] = state.wrapper;
            return { wrapper: prevState.wrapper };
          }
          return prevState;
        })
      });
      uploadWrapper.onError = (err, heading) => {
        // console.error(err, heading);
        if (heading) {
          CommonService.showToast(err, 'error');
        }
      };
      uploadWrapper.onSuccess = (resp) => {
        console.log(resp);
        if (resp && resp.success) {
          CommonService.showToast(resp.msg || resp.error, 'success');
        }
      };
      uploadWrapper.onProgress = (progress) => {
      };
      setFileUpload((prevState: any) => {
        let state: TsFileUploadWrapperClass[] = [];
        if (prevState) {
          state = prevState?.wrapper;
        }
        const newState = [...state, uploadWrapper];
        return { wrapper: newState };
      });
    }
  }

  console.log(fileUpload?.wrapper[1]?.extraPayload)

  const handleAttachmentName = (index:any,RequiredAttachmentsIndex:any)=>{
   let temp = required_attachments[RequiredAttachmentsIndex];
   temp.name = fileUpload?.wrapper[index]?.extraPayload?.expiry_date;
    setFileUpload((prevState: any) => {
      if (prevState) {
        prevState.wrapper[index].extraPayload.file_type = prevState.wrapper[index].extraPayload.expiry_date;
      //  prevState.wrapper[index].extraPayload.expiry_date = '';
      }
      return { wrapper: [...(prevState || { wrapper: [] }).wrapper] };
    })
  }

  const deleteFile = (temp: any, itemIndex: any) => {
    if (required_attachments[temp]) {
      if(temp>12){
        required_attachments[temp].name = "Additional Attachment";
      }
      required_attachments[temp].index = -1;
      setRequiredAttachments([...required_attachments]);
    }
  }

  const handleExpiryDate = (event: any, index: any) => {
    setFileUpload((prevState: any) => {
      if (prevState) {
        prevState.wrapper[index].extraPayload.expiry_date = event.target.value;
      }
      return { wrapper: [...(prevState || { wrapper: [] }).wrapper] };
    })
  }

  return <div>
    <div className="attachments_wrapper">
      {required_attachments?.map((item: any, index: any) => {
        if (item.index !== -1) {
          return (<>
            <div className="attachments">
              <div className="custom_file mrg-top-0">
                <h3 className="mrg-top-20 mrg-bottom-0 file_name file_attachment_title"> {required_attachments[index].name}</h3>
                <div className="d-flex">
                  <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                  <div className="file_details mrg-left-20 mrg-top-20">
                    {index <= 12 ?
                      index === 0 || index === 6 || index === 9 || index === 12 ? <div></div> :
                        <NormalTextField
                          required
                          label={"Expires On"}
                          type={"date"}
                          InputLabelProps={{ shrink: true }}
                          onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                          value={fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.expiry_date}
                          disabled={index === 0 || index === 6 || index === 9 || index === 12}
                          inputProps={{
                            max: '2999-01-01'
                          }}
                        /> :
                      <div className='d-flex'>
                        <NormalTextField
                          required
                          label="Attachment Name"
                          type={"text"}
                          InputLabelProps={{ shrink: true }}
                           onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                          value={fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.expiry_date}
                        /><div className='mrg-top-15 mrg-left-15'><DoneIcon color='primary' onClick={()=>handleAttachmentName(required_attachments[index]?.index,index)}/></div>
                      </div>}
                    <div className={index === 0 || index === 6 || index === 9 || index === 12 ? "file_actions" : "file_actions d-flex"}>
                      <Tooltip title={`View ${item?.name}`}>
                        <p style={{ cursor: 'pointer' }} onClick={() => previewFile(item?.index, "attachment")} className="delete-image">View</p>
                      </Tooltip>
                      <Tooltip title={`Delete ${item?.name}`}>
                        <p style={{ cursor: "pointer", width: "50px" }} className={index === 0 || index === 6 || index === 9 || index === 12 ? "" : "mrg-left-30"} onClick={() => deleteFile(index, item?.index)}>Delete</p>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
          )
        } else {
          return (
            <div className="attachments">
              <div className="">
                <h3 className="attachement_name mrg-left-10 file_attachment_title">{item?.name}</h3>
                <Tooltip title={`Upload ${item?.name}`}>
                  <div>
                    <FileDropZoneComponent
                      OnFileSelected={(item) => OnFileSelected(item, index)} allowedTypes={".pdf"}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          )
        }
      })}
    </div>
  </div>;
}



export default HcpAddAttachmentsComponent;
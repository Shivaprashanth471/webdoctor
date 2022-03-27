import { IconButton, TableRow, TextField, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";

interface readOnlyRowProps {
  education: any;
  handleDeleteClick: any;
  index?: number
}

const ReadOnlyRow = ({ education, handleDeleteClick }: readOnlyRowProps) => {
  return (
     <TableRow className={"mat-tr"}>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.institute_name}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.degree}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.location}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.start_date ? moment(education.start_date).format('MM-YYYY') : "NA"}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.graduation_date ? moment(education.graduation_date).format('MM-YYYY') : "NA"}
          disabled
        />
      </td>

      <td>
        <Tooltip title={`Delete Education`}>
          <IconButton onClick={() => handleDeleteClick(education.tempId)}>
            <DeleteIcon className="delete-icon" />
          </IconButton>
        </Tooltip>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;

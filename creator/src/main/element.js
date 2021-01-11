import React from "react";

import produce from "immer";
import styled from "styled-components";
import { Draggable } from 'react-beautiful-dnd';

import { IconButton, Box, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';

import ElementLabel from "../elements/element-label";
import ElementYoutube from "../elements/element-youtube";
import ElementMultiChoice from "../elements/element-multichoice";
import ElementTextInput from "../elements/element-text-input";
import ElementImage from "../elements/element-image";
import ElementNumberInput from "../elements/element-number-input";
import ElementDocs from "../elements/element-docs";
import ElementLatex from "../elements/element-latex";
import NoticePopup from '../shared/notice-popup';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: '4px',
    border: '1px solid rgb(74, 149, 211)',
    backgroundColor: 'hsl(207, 61%, 98%)',
  },
  dragHandleIcon: {
    marginBottom: theme.spacing(-3),
    textAlign: 'center',
    color: '#BBB',
  },
  dragHandleArea: {
    position: 'relative',
    display: 'hidden',
    width: '100%',
    marginBottom: '-48px',
    height: '48px',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
  },
  select: {
    marginTop: theme.spacing(1),
    height: '24px',
    zIndex: '1',
  },
  warningIcon: {
    color: '#f9a825',
  },
  duplicateButton: {
    marginRight: 'auto',
  },
  deleteButton: {
    marginRight: theme.spacing(1),
    color: theme.palette.negative.main,
  },
}));

export default function Element({
  index,
  structure,
  noticeObject,
  onUpdate,
  onDuplicate,
  onDelete,
}) {
  const classes = useStyles();
  const { type } = structure;
  const { notices } = noticeObject || { notices: [] };

  const handleChangeType = (e) => {
    onUpdate(
      produce(structure, (newStructure) => {
        newStructure.type = e.target.value;
        if (
          newStructure.type === "multi-choice" &&
          newStructure.options === undefined
        ) {
          newStructure.options = [];
        }
      })
    );
  };

  const handleUpdateElement = (updatedElement) => {
    onUpdate(updatedElement);
  };

  const handleDuplicateSelf = () => {
    onDuplicate(structure.id);
  };

  const handleDeleteSelf = () => {
    onDelete(structure.id);
  };

  const elementProps = {
    structure: structure,
    onUpdate: handleUpdateElement,
  };

  let obj;
  switch (structure.type) {
    case "label":
      obj = <ElementLabel {...elementProps} />;
      break;
    case "image":
      obj = <ElementImage {...elementProps} />;
      break;
    case "youtube":
      obj = <ElementYoutube {...elementProps} />;
      break;
    case 'latex':
      obj = <ElementLatex {...elementProps} />;
      break;
    case "docs":
      obj = <ElementDocs {...elementProps} />;
      break;
    case "multi-choice":
      obj = <ElementMultiChoice {...elementProps} />;
      break;
    case "text-input":
      obj = <ElementTextInput {...elementProps} />;
      break;
    case "number-input":
      obj = <ElementNumberInput {...elementProps} />;
      break;
    default:
      obj = <span style={{ visibility: "hidden" }}>אלמנט לא תקין</span>;
  }

  return (
    <Draggable draggableId={structure.id} index={index}>
      {(provided, snapshot) => (
        <div
          id={structure.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${classes.container} ${provided.draggableProps.className}`}
          style={{
            ...provided.draggableProps.style,
            opacity: (snapshot.isDragging && !snapshot.isDropAnimating) ? 0.6 : 1,
          }}
        >
          <Box className={classes.dragHandleArea} {...provided.dragHandleProps}></Box>
          <Box className={classes.dragHandleIcon}>
              <DragHandleIcon />
          </Box>
          <Box className={classes.topBar}>
            {/* <IconButton aria-label="options" className={classes.collapseButton}>
              <MoreVertIcon fontSize="small" />
            </IconButton> */}
            <select value={type} onChange={handleChangeType} className={classes.select}>
              <optgroup label="תצוגה">
                <option value="label">טקסט</option>
                <option value="image">תמונה</option>
                <option value="youtube">סרטון</option>
                <option value="latex">ביטוי מתמטי</option>
                <option value="docs">Google Docs</option>
              </optgroup>
              <optgroup label="מילוי">
                <option value="multi-choice">שאלת בחירה</option>
                <option value="text-input">שאלת כתיבה</option>
                <option value="number-input">שאלת מספר</option>
              </optgroup>
            </select>
            {notices && notices.length ? (
              <NoticePopup mainNoticeObject={noticeObject}>
                <IconButton className={classes.warningIcon}>
                  <WarningIcon fontSize="small" />
                </IconButton>
              </NoticePopup>
            ) : <></>}
            <Tooltip title="שכפל">
              <IconButton className={classes.duplicateButton} onClick={handleDuplicateSelf}>
                <FileCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton aria-label="delete element" className={classes.deleteButton} onClick={handleDeleteSelf}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          {obj}
        </div>
      )}
    </Draggable>
  );
}

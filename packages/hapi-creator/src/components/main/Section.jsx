/* eslint-disable no-param-reassign */
import React, { useState } from 'react';

import {
  Box,
  Button,
  Collapse,
  Grow,
  IconButton,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { v1 as uuid } from 'uuid';
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PropTypes from 'prop-types';
import produce from 'immer';

import { DEFAULT_ELEMENT } from '../../constants';
import { noticeObjectType } from '../../prop-types';
import { sectionStructureType } from '../../../../common/prop-types';
import Editable from '../common/Editable';
import Element from './Element';
import FocusAwarePaper from '../common/FocusAwarePaper';
import NoticePopup from '../common/NoticePopup';
import RotatingIcon from '../common/RotatingIcon';
import replaceIds from '../../replace-ids';

const useStyles = makeStyles((theme) => ({
  section: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
    borderRadius: '8px',
  },
  sectionContainer: {
    paddingTop: theme.spacing(2),
  },
  dragHandle: {
    marginBottom: theme.spacing(0),
    textAlign: 'center',
    color: '#BBB',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
  },
  topBarSpacer: {
    marginRight: theme.spacing(2),
  },
  noticesButton: {
    width: '48px',
    height: '50px',
    // borderRadius: '50%',
  },
  noticesIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: theme.palette.warning.main,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  noticesNumber: {
    fontSize: '0.8rem',
    color: 'white',
    position: 'relative',
    fontWeight: 'bold',
  },
  deleteButton: {
    color: theme.palette.negative.main,
  },
  center: {
    textAlign: 'center',
  },
  droppable: {
    marginTop: theme.spacing(4),
  },
  addIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(-1.5),
  },
}));

function Section({
  index,
  structure,
  noticeObjects,
  onUpdate,
  onDuplicate,
  onDelete,
}) {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(true); // Whether if open or collapsed
  const [isVisible, setIsVisible] = useState(true);

  // Notice object of this section
  const sectionNoticeObject = noticeObjects.find(({ id }) => id === structure.id);
  // Notice objects of elements that belong to this section
  const elementsNoticeObjects = noticeObjects.filter(({ id }) => (
    structure.elements.find((element) => id === element.id)
  ));
  const sectionNoticeCount = sectionNoticeObject ? sectionNoticeObject.notices.length : 0;
  const elementsNoticeCount = elementsNoticeObjects.flatMap(({ notices }) => notices).length;
  const totalNoticeCount = sectionNoticeCount + elementsNoticeCount;

  const handleChangeHeader = (text) => {
    onUpdate(produce(structure, (newStructure) => {
      newStructure.header = text;
    }));
  };

  const handleCollapseClick = (e) => {
    e.target.focus();
    setIsOpen(!isOpen);
  };

  const handleUpdateElement = (updatedElement) => {
    onUpdate(produce(structure, (newStructure) => {
      newStructure.elements.forEach((element, i) => {
        if (element.id === updatedElement.id) {
          newStructure.elements[i] = updatedElement;
        }
      });
    }));
  };

  const handleClickAddElement = () => {
    onUpdate(produce(structure, (newStructure) => {
      newStructure.elements.push(produce(DEFAULT_ELEMENT, (newElement) => {
        newElement.id = uuid(10);
      }));
    }));
  };

  const handleDuplicateElement = (elementId) => {
    onUpdate(produce(structure, (newStructure) => {
      newStructure.elements.push(replaceIds(structure.elements.find((s) => s.id === elementId)));
    }));
  };

  const handleDeleteElement = (elementId) => {
    onUpdate(produce(structure, (newStructure) => {
      const i = structure.elements.findIndex(({ id }) => id === elementId);
      newStructure.elements.splice(i, 1);
    }));
  };

  const handleMoveUpElement = (elementId) => {
    onUpdate(produce(structure, (newStructure) => {
      const o = newStructure.elements;
      const i = o.findIndex(({ id }) => id === elementId);
      if (i > 0) {
        [o[i], o[i - 1]] = [o[i - 1], o[i]];
      }
    }));
  };

  const handleMoveDownElement = (elementId) => {
    onUpdate(produce(structure, (newStructure) => {
      const o = newStructure.elements;
      const i = o.findIndex(({ id }) => id === elementId);
      if (i >= 0 && i < o.length - 1) {
        [o[i], o[i + 1]] = [o[i + 1], o[i]];
      }
    }));
  };

  const handleDuplicateSelf = () => {
    onDuplicate(structure.id);
  };

  const handleDeleteSelf = (e) => {
    e.target.focus();
    setIsVisible(false);
  };

  const handleDeleteTransitionExited = () => {
    if (!isVisible) {
      onDelete(structure.id);
    }
  };

  return (
    <Draggable draggableId={structure.id} index={index}>
      {(provided, snapshot) => (
        <div
          id={structure.id}
          ref={provided.innerRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            opacity: (snapshot.isDragging && !snapshot.isDropAnimating) ? 0.8 : 1,
          }}
        >
          <Grow
            in={isVisible}
            onExited={handleDeleteTransitionExited}
            timeout={{ enter: 400, exit: 200 }}
          >
            <Box className={classes.sectionContainer}>
              <FocusAwarePaper
                className={classes.section}
                isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
              >
                <Box className={classes.dragHandle}>
                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                  <div {...provided.dragHandleProps}>
                    <DragHandleIcon />
                  </div>
                </Box>
                <Box className={classes.topBar}>
                  <Editable size={2} onChange={handleChangeHeader} isHeightFixed height="50px">
                    {structure.header}
                  </Editable>
                  <div className={classes.topBarSpacer} />
                  {Boolean(totalNoticeCount) && (
                    <NoticePopup
                      mainNoticeObject={sectionNoticeObject}
                      childrenNoticeObjects={elementsNoticeObjects}
                    >
                      <IconButton className={classes.noticesButton}>
                        <div className={classes.noticesIcon}>
                          <span className={classes.noticesNumber}>{totalNoticeCount}</span>
                        </div>
                      </IconButton>
                    </NoticePopup>
                  )}
                  <IconButton onClick={handleCollapseClick} id={`${structure.id}`}>
                    <RotatingIcon
                      active={isOpen}
                      passiveIcon={<ArrowDownwardIcon />}
                      activeIcon={<ArrowUpwardIcon />}
                    />
                  </IconButton>
                  <Tooltip title="שכפל">
                    <IconButton onClick={handleDuplicateSelf}>
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton className={classes.deleteButton} onClick={handleDeleteSelf}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Box>
                <Collapse in={isOpen} unmountOnExit>
                  <Box className={classes.droppable}>
                    <Droppable droppableId={structure.id} type="ELEMENT">
                      {/* eslint-disable-next-line no-shadow */}
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...provided.droppableProps}
                        >
                          {structure.elements.map((element, i) => (
                            <Element
                              key={element.id}
                              index={i}
                              structure={element}
                              noticeObject={
                                elementsNoticeObjects.find(({ id }) => id === element.id)
                              }
                              onUpdate={handleUpdateElement}
                              onDuplicate={handleDuplicateElement}
                              onDelete={handleDeleteElement}
                              onMoveUp={handleMoveUpElement}
                              onMoveDown={handleMoveDownElement}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Box>
                  <br />
                  <Box className={classes.center}>
                    <Button
                      onClick={handleClickAddElement}
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon className={classes.addIcon} />}
                    >
                      <b>רכיב חדש</b>
                    </Button>
                  </Box>
                </Collapse>
              </FocusAwarePaper>
            </Box>
          </Grow>
        </div>
      )}
    </Draggable>
  );
}

Section.propTypes = {
  index: PropTypes.number.isRequired,
  structure: sectionStructureType.isRequired,
  noticeObjects: PropTypes.arrayOf(noticeObjectType),
  onUpdate: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func,
};

Section.defaultProps = {
  noticeObjects: [],
  onUpdate: () => {},
  onDuplicate: () => {},
  onDelete: () => {},
};

export default Section;

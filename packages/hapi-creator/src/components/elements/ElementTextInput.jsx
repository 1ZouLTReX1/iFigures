import React from 'react';

import produce from 'immer';

import Checkbox from '../common/Checkbox';
import Editable from '../common/Editable';

function ElementTextInput({ structure, onUpdate }) {

  const handleChangeText = (text) => {
    onUpdate(produce(structure, newStructure => {
      newStructure.text = text;
    }))
  }

  const handleCheckMultiline = (multiline) => {
    onUpdate(produce(structure, newStructure => {
      if (multiline) {
        newStructure.multiline = multiline;
      } else {
        delete newStructure.multiline;
      }
    }))
  }
  
  return (
    <React.Fragment>
      <Editable onChange={handleChangeText}>{structure.text}</Editable>
      <br /><br />
      <Checkbox 
        id={structure.id + '-shuffle'}
        checked={structure.multiline}
        onCheck={handleCheckMultiline}
      >
        תשובה ארוכה? (יותר משורה אחת)
      </Checkbox>
    </React.Fragment>
  );
}

export default ElementTextInput;

import React from 'react';

export const Colors = (props) => {

  const allColors = props.list.map((color) => {    
    const active = color === props.activeColor ? 'active' : '';  

    return (
      <div
        className={'color-holder ' + color + ' ' + active}
        key={color}
        onClick={() => { props.action(color) }} >
        {color}
      </div>
      )
    })

  return (
    <div className='colors'>
      {allColors}
    </div>
    );
}
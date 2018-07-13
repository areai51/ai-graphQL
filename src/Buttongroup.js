import React from 'react'

export default ({
    buttons,
    activebtn,
    onButtonClick
})=> (
    <div className="btn-group-parent">
        {
            buttons && (
                buttons.map((value,index)=>{
                    return (
                    <button 
                        className={"btn " + ( (activebtn === index) ? 'selected' : '' ) }
                        key={index} 
                        onClick={()=>onButtonClick(index)}>{value}
                    </button>
                    )
                })
            )
        }
    </div>
)
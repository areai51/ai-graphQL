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
                    <div key={'radiowrapper'+index}  className='languages'>
                        <input type='radio' name='language' id={'lang'+index} value={value}
                            className={"btn " + ( (activebtn === index) ? 'selected' : '' ) }
                            key={'radio'+index} 
                            onClick={()=>onButtonClick(index)}/>
                        <label key={'label'+index} htmlFor={'lang'+index}>{value}</label>
                    </div>
                    )
                })
            )
        }
    </div>
)
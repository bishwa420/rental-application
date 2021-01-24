import React from 'react'
import spinner from '../image/ajax-loader.gif'

const Modal = props => {

    return (
        <div className={props.show ? 'modal fade show in' : 'modal fade'}
             id={props.id} tabIndex="-1"
             role="dialog"
             aria-labelledby="ModalLabel" style={{visibility: props.show ? 'visible' : 'hidden', marginTop: '-27em'}}>

            <div className="modal-dialog"
                role="document">
                <div className="modal-content">
                    <div className="modal-header">

                        <h4 className="modal-title" id="ModalLabel" style={{lineHeight: '0.5'}}>{props.title}</h4>
                        <button type="button" className="close" data-dismiss="modal"
                                onClick={() => props.action.close()}
                                aria-label="Close">
                            <i className="fa fa-times" style={{fontSize: '14px'}}></i>
                        </button>
                    </div>

                    {props.fixedHeight === true ?
                        (<div className="modal-body" style={{
                            maxHeight: 500,
                            overflowY: 'auto',
                            maxWidth: 580,
                            overflowX: 'auto'
                        }}>
                            {props.children}
                        </div>)
                        :
                        (<div className="modal-body">
                            {props.children}

                        </div>)}
                    <div className="modal-footer">
                        {props.show && props.isLoading ? <img src={spinner} style={{
                            width: 20,
                            height: 20,
                            marginTop: -5,
                            marginRight: 10
                        }} alt = "Ajax loader" /> : null}

                        <button type="button" className="btn btn-success"
                            disabled={props.show && props.isLoading}
                            onClick={() => props.action.confirm()}>
                            {props.confirmButtonName ? props.confirmButtonName : 'Confirm'}
                        </button>
                        <button type="button" className="btn btn-link"
                            data-dismiss="modal"
                            onClick={() => props.action.close()} style={{color: '#333'}}>
                            {props.closeButtonName ? props.closeButtonName : 'Close'}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Modal
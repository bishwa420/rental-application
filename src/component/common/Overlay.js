import React from "react"
import BounceLoader from "react-spinners/BounceLoader";
import LoadingOverlay from "react-loading-overlay";

export default function Overlay(props) {

    return (
        <LoadingOverlay
            active={props.active}
            spinner={<BounceLoader/>}
            styles={{
                overlay: (base) => ({
                    ...base,
                    background: 'rgba(151, 135, 135, 0.05)'
                }),
                wrapper: {
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 1,
                    transition: '.3s ease',
                    background: '#01164626',
                    zIndex: 9999,
                    visibility: props.active ? 'visible' : 'hidden'
                }
            }}/>
    )
}
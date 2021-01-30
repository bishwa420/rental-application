export const sliderStyle = {
    position: 'relative',
    width: '100%',
    height: '30',
    marginTop: '1em'
}

export const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 5,
    backgroundColor: '#4564b5'
}

export function Handle({
    handle: {id, value, percent},
    getHandleProps}) {

    return (
        <div style={{
            left: `${percent}%`,
            position: 'absolute',
            marginLeft: -15,
            marginTop: 25,
            zIndex: 2,
            width: 30,
            height: 30,
            border: 0,
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            backgroundColor: '#2C4870',
            color: '#333'}}
            {...getHandleProps(id)}>
            <div style={{fontFamily: 'Roboto', fontSize: 11, marginTop: -35}}>
                {value}
            </div>
        </div>
    )
}

export function Track({ source, target, getTrackProps }) {
    return (
        <div
            style={{
                position: 'absolute',
                height: 10,
                zIndex: 1,
                marginTop: 35,
                backgroundColor: '#b58488',
                borderRadius: 5,
                cursor: 'pointer',
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    )
}
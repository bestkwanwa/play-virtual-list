import React, { useEffect, useRef, useState, useMemo } from 'react';
import './App.css';

/** 可视区域高度 */
const CONTAINER_HEIGHT = 500

/** 子项高度 */
const ITEM_HEIGHT = 50

/** 初始渲染个数 */
const PRE_LOAD_COUNT = CONTAINER_HEIGHT / ITEM_HEIGHT

export default function App() {

    /** 可视容器 */
    const container = useRef(null)

    /** 数据源 */
    const [data, setData] = useState([])

    /** 渲染范围 */
    const [range, setRange] = useState({
        start: 0,
        end: 2 * PRE_LOAD_COUNT
    })

    /** 总高度 */
    const totalHeight = useMemo(() => {
        return data.length * ITEM_HEIGHT;
    }, [data]);

    /** 空白占位高度 */
    const marginTop = useMemo(() => {
        return range.start * ITEM_HEIGHT;
    }, [range.start]);

    const generateData = () => {
        setData(() => {
            return Array.from(Array(1000).keys()).map((value, index) => {
                return {
                    value,
                    index
                }
            })
        })
    }

    const update = () => {
        const element = container.current
        if (element) {
            const top = Math.floor(element.scrollTop / ITEM_HEIGHT)
            const showCount = Math.floor(element.clientHeight / ITEM_HEIGHT)
            const bottom = top + showCount
            setRange({
                start: top - 10 > 0 ? top - 10 : 0,
                end: bottom + 10 < data.length ? bottom + 10 : data.length
            })
        }
    }

    const handleScroll = (e) => {
        e.preventDefault()
        update()
    }

    useEffect(() => {
        generateData()
    }, [])

    return (
        <>
            {`range from ${range.start} to ${range.end}`}
            <div id='container' ref={container} style={{ overflow: 'auto', height: CONTAINER_HEIGHT, backgroundColor: "pink" }} onScroll={handleScroll}>
                <div
                    style={{
                        width: '100%',
                        marginTop,  // 空白的占位高度
                        height: totalHeight - marginTop // 不设置定高可以有一个下拉刷新的交互
                    }}
                >
                    {data.slice(range.start, range.end).map(item => {
                        return (
                            <div className='item' key={item.value} style={{ height: ITEM_HEIGHT }}>
                                Item {item.value}
                            </div>
                        )
                    })}

                </div>
            </div>
        </>
    )
}
import React, { useCallback, useState, useEffect } from 'react';
import { debounce, pickBy } from 'lodash';
import { Inertia } from '@inertiajs/inertia';
import Parser from 'html-react-parser';

export default function DataTable({ data, url, header, button }) {
    const { data: tableData, meta, filtered, attributes } = data
    const [params, setParams] = useState(filtered)

    const reload = useCallback(
        debounce((query) => {
            Inertia.get(
                url,
                { ...pickBy(query), page: query.q ? 1 : query.page },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            )
        }, 150)
        ,
        []
    )

    useEffect(() => reload(params), [params])

    const onChange = (event) => setParams({ ...params, [event.target.name]: event.target.value })
    const sort = (item) => {
        setParams({
            ...params,
            field: item,
            direction: params.direction == 'asc' ? 'desc' : 'asc'
        })
    }

    // console.log(data)

    return (
        <div className="card">
            <div className="card-header">
                <h4>
                    <select className="form-control py-0 px-1" style={{ height: '31px', borderRadius: 'unset' }}>
                        {[10, 50, 100, 500, 1000].map((page, index) => <option key={index}>{page}</option>)}
                    </select>
                </h4>
                <div className="card-header-form">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search"
                        name="q" 
                        id="q" 
                        onChange={onChange} 
                        value={params.q}
                    />
                </div>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-md">
                        <thead>
                            <tr>
                                {header.map((row, index) => (
                                    <th key={index}>
                                        {
                                            row.order
                                            ?   
                                                <>
                                                    {row.as}
                                                    <div className="float-right" onClick={() => sort(`${row.name}`)}>
                                                        { params.field == `${row.name}` && params.direction == "asc" && <i className="fas fa-arrow-up"></i> }
                                                        { params.field == `${row.name}` && params.direction == "desc" && <i className="fas fa-arrow-down"></i> }
                                                        { params.field != `${row.name}` && <><i className="fas fa-arrow-up"></i><i className="fas fa-arrow-down"></i></> }
                                                    </div>
                                                </>
                                            :   row.as
                                        }
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {meta.from + index}
                                    </td>
                                    {header.map((head, idx, {length}) => (
                                        idx + 1 === length
                                        ?   <td key={row.id} className="px-6 py-4 whitespace-nowrap">
                                                {button(row, reload, params)}
                                            </td>
                                        : idx > 0
                                            ?   <td key={row[head.name]} className="px-6 py-4 max-w-md min-w-sm">
                                                    {row[head.name]}
                                                </td>
                                            : false
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer text-center">
                <nav className="d-inline-block">
                    <ul className="pagination mb-0">
                        {meta.links.map((item, index) => (
                            <li 
                                key={index}
                                className={
                                    `page-item ${item.url == null ? 'disabled' : 'page-item'} ${item.active == true ? ' active' : ''}`
                                } 
                                onClick={() => setParams({ ...params, page: new URL(item.url).searchParams.get('page') })}
                            >
                                <a className="page-link">{Parser(item.label)}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

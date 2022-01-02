import React, { useCallback, useState, useEffect } from 'react';
import { debounce, pickBy } from 'lodash';
import { Inertia } from '@inertiajs/inertia';
import Parser from 'html-react-parser';

const UpIcon = () => <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
const DownIcon = () => <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>

export default function DataTable({ data, url, tableHeader, btnAction }) {
    const { data: tableData, meta, filtered, attributes } = data
    const [params, setParams] = useState(filtered)
    const [pageNumber, setPageNumber] = useState([])

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
    
    useEffect(() => {
        let numbers = [];
        for (let i = attributes.per_page; i <= attributes.total / attributes.per_page; i = i + attributes.per_page) {
            numbers.push(i)
        }
        setPageNumber(numbers)
    }, [])

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
        <>
            <div className="flex items-center justify-end">
                <div className="w-1/2">
                    <div className="flex items-center justify-end gap-x-2 mb-6">
                        <select name="load" id="load" onChange={onChange} value={params.load} className="rounded-lg border-gray-300 focus:ring-blue-200 focus:ring transition duration-150 ease-in form-select">
                            {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                        </select>
                        <div className="flex items-center gap-x-2 rounded-lg bg-white px-2 border-gray-300 focus-within:ring-blue-200 focus-within:ring border focus-within:border-blue-400 transition duration-150 ease-in">
                            <svg className="w-5 h-5 inline text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input type="text" name="q" id="q" onChange={onChange} value={params.q} className="border-0 focus:ring-0 form-text w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 xl:mx-2">
                    <div className="py-4 inline-block min-w-full">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        {tableHeader.map((row, index) => (
                                            <th
                                                key={row.as}
                                                scope="col"
                                                className="text-sm font-medium text-gray-900 px-6 py-4"
                                            >
                                                {
                                                    row.order
                                                    ?   <div className="cursor-pointer flex items-center gap-x-2" onClick={() => sort(`${row.name}`)}>
                                                            {row.as}
                                                            { params.field == `${row.name}` && params.direction == "asc" && <UpIcon/> }
                                                            { params.field == `${row.name}` && params.direction == "desc" && <DownIcon/> }
                                                        </div>
                                                    :   row.as
                                                }
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableData.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {meta.from + index}
                                            </td>
                                            {tableHeader.map((head, idx, {length}) => (
                                                idx + 1 === length
                                                ?   <td key={row.id} className="px-6 py-4 whitespace-nowrap">
                                                        {btnAction(row, reload, params)}
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
                </div>
            </div>

            <ul className="flex items-center gap-x-1 mt-10">
                {meta.links.map((item, index) => (
                    <button 
                        key={index} 
                        disabled={item.url == null ? true : false} 
                        className={`${item.url == null ? 'text-gray-500 cursor-default' : 'text-gray-800'} h-9 rounded-lg flex items-center justify-center border bg-white ${item.label.includes('Previous') || item.label.includes('Next') ? 'w-24' : 'w-12'}`} 
                        onClick={() => setParams({ ...params, page: new URL(item.url).searchParams.get('page') })}
                    >
                        {Parser(item.label)}
                    </button>
                ))}
            </ul>
        </>
    )
}

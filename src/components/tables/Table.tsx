import { ReactNode } from "react";
import { TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Table, Text, Subtitle, Metric, TextInput, Button, Title } from "@tremor/react";
import { Card } from "../layout/Card";
import { DeleteButton } from "../inputs/Buttons";

export interface Table {
    title: string;
    columns: string[];
    actions?: ReactNode;
    rows: {
        [key: string]: ReactNode;
    }[];
    onClick?: (row: any) => void;
    onDelete?:(row: any) => void;
}

export function TableElm({ columns, rows, onClick, title, actions, onDelete}: Table) {

    let renderColumn = [...columns]
    if (onDelete) {
        renderColumn.push('Delete')
    }

    return <>
        <Card title={title} noPadding actions={actions}>
            <Table className="overflow-x-auto w-full ">
                <TableHead className="border-b border-r border-l">
                    <TableRow>
                        {renderColumn.map((column) => {
                            return <TableHeaderCell 
                                    className="text-sm uppercase tracking-wider max-w-[300px] overflow-hidden whitespace-nowrap"
                                    key={column}
                                    children={column}
                                />
                        })}
                    </TableRow>
                </TableHead>
                <TableBody className="space-y-2 border">
                    {
                        rows.map((location, i) => {
                            return <TableRow 
                                key={i}
                                onClick={() => onClick && onClick(location)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {renderColumn.map((column) => {

                                    if (column === 'Delete') {
                                        return <TableCell key={column}>
                                            <DeleteButton 
                                                onClick={() => onDelete && onDelete(location)}
                                                text="Delete"
                                            />
                                        </TableCell>
                                    }

                                    return <TableCell 
                                        className="max-w-[300px] overflow-hidden whitespace-nowrap"
                                        key={column}>
                                            {location[column]}
                                    </TableCell>
                                })}
                            </TableRow>
                        })
                    }   
                    {
                        rows.length === 0 && <TableRow>
                            <TableCell colSpan={renderColumn.length} className="text-center">
                                <Subtitle>No rows</Subtitle>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </Card>
    </>
}
// 'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@tremor/react';
import { Input } from '../../../../../components/ui/Input';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const data = [
    {
        workspace: 'sales_by_day_api',
        owner: 'John Doe',
        status: 'Live',
        costs: '$3,509.00',
        region: 'US-West 1',
        capacity: '99%',
        lastEdited: '23/09/2023 13:00',
    },
    {
        workspace: 'marketing_campaign',
        owner: 'Jane Smith',
        status: 'Live',
        costs: '$5,720.00',
        region: 'US-East 2',
        capacity: '80%',
        lastEdited: '22/09/2023 10:45',
    },


];

export default function TableDeadline() {
    return (
        <>
            <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
                <Input
                    placeholder="Search workspace..."
                    className="h-9 w-full rounded-tremor-small md:max-w-xs"
                />
            </div>
            <Table className="mt-4">
                <TableHead>
                    <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                        <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Workspace
                        </TableHeaderCell>
                        <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Owner
                        </TableHeaderCell>
                        <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Region
                        </TableHeaderCell>
                        <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Capacity
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Costs
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Last edited
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.workspace}>
                            <TableCell className="font-medium text-sm text-gray-600 text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {item.workspace}
                            </TableCell>
                            <TableCell className={
                                "relative text-sm text-gray-600"
                            }>{item.owner}</TableCell>
                            <TableCell>
                                <span
                                    className={classNames(
                                        item.status === 'Live'
                                            ? 'bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-500/20 dark:text-emerald-500 dark:ring-emerald-400/20'
                                            : 'bg-orange-100 text-orange-800 ring-orange-600/10 dark:bg-orange-500/20 dark:text-orange-500 dark:ring-orange-400/20',
                                        'inline-flex items-center rounded-tremor-small px-2 py-0.5 text-tremor-label font-medium ring-1 ring-inset',
                                    )}
                                >
                                    {item.status}
                                </span>
                            </TableCell>
                            <TableCell className={
                                "relative text-sm text-gray-600"
                            }>{item.region}</TableCell>
                            <TableCell className={
                                "relative text-sm text-gray-600"
                            }>{item.capacity}</TableCell>
                            <TableCell className="text-right relative text-sm text-gray-600">{item.costs}</TableCell>
                            <TableCell className="text-right">{item.lastEdited}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

export default function DataDisplay({ report }) {
    return (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>How many longs and shorts?</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Symbol</Th>
                        <Th isNumeric>Short(s)</Th>
                        <Th isNumeric>Long(s)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {report?.map(({ symbol, long, short }) => (
                        <Tr key={symbol}>
                            <Td>{symbol}</Td>
                            <Td isNumeric>{long}</Td>
                            <Td isNumeric>{short}</Td>
                        </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Symbol</Th>
                        <Th isNumeric>Short(s)</Th>
                        <Th isNumeric>Long(s)</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

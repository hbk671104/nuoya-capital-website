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
  Tag,
} from '@chakra-ui/react'

export default function DataDisplay({ report }) {
  return (
    <TableContainer>
      <Table>
        <TableCaption>How many longs and shorts?</TableCaption>
        <Thead>
          <Tr>
            <Th>Symbol</Th>
            <Th isNumeric>Short(s)</Th>
            <Th isNumeric>Long(s)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {report?.map(({ symbol, short, long }) => (
            <Tr key={symbol}>
              <Td>
                <Tag size="lg">{symbol}</Tag>
              </Td>
              <Td isNumeric>{short}</Td>
              <Td isNumeric>{long}</Td>
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

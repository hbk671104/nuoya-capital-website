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
  const columns = (
    <Tr>
      <Th>Symbol</Th>
      <Th isNumeric>Short(s)</Th>
      <Th isNumeric>Long(s)</Th>
      <Th isNumeric>Delta</Th>
      <Th isNumeric>Gamma</Th>
      <Th isNumeric>Last Price</Th>
    </Tr>
  )

  return (
    <TableContainer>
      <Table size="sm">
        {/* <TableCaption>How many longs and shorts?</TableCaption> */}
        <Thead>{columns}</Thead>
        <Tbody>
          {report?.map(({ symbol, short, long, delta, gamma, lastPrice }) => (
            <Tr key={symbol}>
              <Td>
                <Tag>{symbol}</Tag>
              </Td>
              <Td isNumeric className="text-red-500">
                {short}
              </Td>
              <Td isNumeric className="text-emerald-500">
                {long}
              </Td>
              <Td isNumeric>{delta}</Td>
              <Td isNumeric>{gamma}</Td>
              <Td isNumeric>{lastPrice}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>{columns}</Tfoot>
      </Table>
    </TableContainer>
  )
}

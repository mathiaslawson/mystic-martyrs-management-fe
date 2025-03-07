
import CellDetails from "./CellDetails"


const CellDetailPage = ({
  params,
}: {
  params: { id: string }
}) => {
  return (
    <CellDetails
      data={{
        cell_id: params.id,
        cell_name: "",
        cell_leader_id: "",
      }}
    />
  )
}

export default (CellDetailPage)


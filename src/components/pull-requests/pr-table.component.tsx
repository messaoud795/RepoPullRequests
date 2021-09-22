import style from "./pr.module.scss";
import { format, parseISO } from "date-fns";
import { PrResponse } from "../../services/http/pull-requests/pr.types";

interface PRComponentProps {
  pullRequestsFiltered: Array<PrResponse>;
  table_headers: string[];
}

const PRTableComponent: React.FC<PRComponentProps> = ({
  pullRequestsFiltered,
  table_headers,
}) => {
  return (
    <div className={style.container}>
      <table className={style.table}>
        <thead>
          <tr>
            {table_headers.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pullRequestsFiltered.map((pr) => (
            <tr key={pr.id}>
              <td>{pr.id}</td>
              <td>{pr.title}</td>
              <td>{pr.state}</td>
              <td>
                {format(parseISO(pr.created_at), "HH:mm ")} --{" "}
                {format(parseISO(pr.created_at), "dd/MM/yyyy")}
              </td>

              <td>{pr.labels.map((label) => label.name).toString()}</td>
              <td>{pr.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PRTableComponent;

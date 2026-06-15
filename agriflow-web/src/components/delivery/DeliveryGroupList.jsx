import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import DeliveryGroupCard from "./DeliveryGroupCard";

export default function DeliveryGroupList({
    groups = [],
    loading = false,
    linkPrefix = "/delivery/groups",
    onSearch,
    searchValue,
    onFilterStatus,
    statusValue,
}) {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="text-muted mt-2">Loading delivery groups…</p>
            </div>
        );
    }

    return (
        <>
            {(onSearch || onFilterStatus) && (
                <div className="d-flex flex-wrap gap-3 mb-3">
                    {onSearch && (
                        <InputGroup style={{ maxWidth: "320px" }}>
                            <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                            <Form.Control
                                placeholder="Search by zone…"
                                value={searchValue || ""}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </InputGroup>
                    )}
                    {onFilterStatus && (
                        <Form.Select
                            style={{ maxWidth: "180px" }}
                            value={statusValue || ""}
                            onChange={(e) => onFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="planned">Planned</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                        </Form.Select>
                    )}
                </div>
            )}

            {groups.length === 0 ? (
                <div className="text-center py-5">
                    <div style={{ fontSize: "3rem" }}>🚚</div>
                    <h5 className="mt-3">No delivery groups found</h5>
                    <p className="text-muted">Groups will appear once orders are ready for delivery.</p>
                </div>
            ) : (
                <Row className="g-4">
                    {groups.map((group) => (
                        <Col key={group.id} sm={6} lg={4} xl={3}>
                            <DeliveryGroupCard group={group} linkPrefix={linkPrefix} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
}

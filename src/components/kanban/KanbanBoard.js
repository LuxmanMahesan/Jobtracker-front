import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { COLONNES_KANBAN } from "./colonnesKanban";
import CarteCandidature from "./CarteCandidature";
import "./kanban.css";

export default function KanbanBoard({ candidatures, surChangementStatut }) {
    const candidaturesParStatut = COLONNES_KANBAN.reduce((acc, col) => {
        acc[col.cle] = candidatures.filter((c) => c.statut === col.cle);
        return acc;
    }, {});

    const finDrag = (resultat) => {
        const { destination, source, draggableId } = resultat;

        if (!destination) return;

        const memeColonne = destination.droppableId === source.droppableId;
        const memePosition = destination.index === source.index;

        if (memeColonne && memePosition) return;

        const id = Number(draggableId);
        const nouveauStatut = destination.droppableId;

        surChangementStatut(id, nouveauStatut);
    };

    return (
        <DragDropContext onDragEnd={finDrag}>
            <div className="kanban">
                {COLONNES_KANBAN.map((col) => (
                    <Droppable droppableId={col.cle} key={col.cle}>
                        {(fourni) => (
                            <div
                                className="colonne"
                                ref={fourni.innerRef}
                                {...fourni.droppableProps}
                            >
                                <div className="colonneTitre">{col.titre}</div>

                                {(candidaturesParStatut[col.cle] || []).map((c, index) => (
                                    <Draggable
                                        key={c.id}
                                        draggableId={String(c.id)}
                                        index={index}
                                    >
                                        {(fourni2) => (
                                            <div
                                                ref={fourni2.innerRef}
                                                {...fourni2.draggableProps}
                                                {...fourni2.dragHandleProps}
                                                className="draggableWrap"
                                            >
                                                <CarteCandidature candidature={c} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {fourni.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}

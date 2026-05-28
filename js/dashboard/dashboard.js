import { createWidgets } from "./widgets.js";
import { initializeDragSystem } from "./dragSystem.js";

export function initializeDashboard() {

    createWidgets();

    initializeDragSystem();

}

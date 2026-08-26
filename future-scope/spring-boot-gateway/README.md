# Spring Boot API Gateway (Future Scope)

## Overview
This directory contains MonsoonController.java, a planned Spring Boot API Gateway layer designed for enterprise production deployment.

## Purpose
In a production deployment, this gateway serves as a reverse proxy in front of the FastAPI inference engine (http://localhost:8000), handling:
- User authentication and role-based access control (RBAC)
- Rate limiting and API quota enforcement
- Request auditing, metrics logging, and enterprise monitoring
- Multi-service orchestration across regional weather microservices

## Prototype Architecture
For the current SIH26086 prototype and live demonstration, the React frontend connects directly to the high-performance FastAPI backend on port 8000. This minimizes runtime moving parts and ensures optimal latency during live demonstrations.

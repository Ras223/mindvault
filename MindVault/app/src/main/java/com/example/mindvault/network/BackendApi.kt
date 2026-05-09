package com.example.mindvault.network

import retrofit2.http.Body
import retrofit2.http.POST

data class IngestRequest(
    val content: String,
    val type: String = "text"
)

data class IngestResponse(
    val success: Boolean,
    val message: String,
    val chunks: Int? = null,
    val error: String? = null
)

data class ChatRequest(
    val query: String
)

data class ChatResponse(
    val answer: String,
    val sources: List<String>?,
    val error: String? = null
)

interface BackendApi {
    @POST("api/ingest")
    suspend fun ingestContent(@Body request: IngestRequest): IngestResponse

    @POST("api/chat")
    suspend fun askQuestion(@Body request: ChatRequest): ChatResponse
}

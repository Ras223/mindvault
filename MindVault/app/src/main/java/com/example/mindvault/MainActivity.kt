package com.example.mindvault

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Surface
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import com.example.mindvault.db.ChatDatabase
import com.example.mindvault.ui.ChatScreen
import com.example.mindvault.ui.ChatViewModel
import com.example.mindvault.ui.ChatViewModelFactory
import com.example.mindvault.ui.DrawerContent
import com.example.mindvault.ui.theme.MindVaultTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Inisiasi database dan DAO
        val database = ChatDatabase.getDatabase(this)
        val chatDao = database.chatDao()
        
        // Inisiasi ViewModel dengan Factory
        val viewModel: ChatViewModel by viewModels {
            ChatViewModelFactory(chatDao)
        }

        setContent {
            MindVaultTheme {
                val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
                val scope = rememberCoroutineScope()

                ModalNavigationDrawer(
                    drawerState = drawerState,
                    drawerContent = {
                        DrawerContent(
                            onCloseDrawer = {
                                scope.launch { drawerState.close() }
                            }
                        )
                    }
                ) {
                    // A surface container using the 'background' color from the theme
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        ChatScreen(
                            viewModel = viewModel,
                            onOpenDrawer = {
                                scope.launch { drawerState.open() }
                            }
                        )
                    }
                }
            }
        }
    }
}
